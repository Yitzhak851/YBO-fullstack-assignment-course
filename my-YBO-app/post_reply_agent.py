# my-YBO-app/post_reply_agent.py 

import json
import os
import re
import urllib.request
import urllib.error

SYSTEM_PROMPT = (
    "You are CommunityBot on our social platform. Be concise and kind. "
    "Reply to a post in one or two sentences."
)


def search_web(query: str) -> str:
    # Stand-in for a real search API.
    evidence = {
        "coffee after 2pm and sleep": (
            "Weak evidence: caffeine can affect sleep for some people; "
            "effects vary by person and dose."
        ),
    }
    return evidence.get(query, "No strong evidence found.")

def call_llm_stub(prompt: str) -> str:
    if "Decide whether the POST contains a real-world claim" in prompt:
        if "Drinking coffee" in prompt:
            return "YES"
        return "NO"

    if "Is the POST written in English?" in prompt:
        if "Hola" in prompt or "Buenos" in prompt or "Bonjour" in prompt or "Guten" in prompt:
            return "NO"
        return "YES"

    if "POST: Beautiful sunrise" in prompt:
        return "Beautiful sunrise sounds lovely — hope it brightened your morning."

    if "POST: The weather is nice" in prompt:
        return "Hope you're enjoying the nice weather!"

    if "Drinking coffee" in prompt and "sleep" in prompt and "OBSERVATION:" not in prompt:
        return "ACTION: search_web(\"coffee after 2pm and sleep\")"

    if "OBSERVATION:" in prompt and "Drinking coffee" in prompt:
        return "FINAL: ⚠️ misleading — evidence shows caffeine can affect sleep for some people, but it is not guaranteed."

    if "Hola" in prompt or "Buenos" in prompt or "Bonjour" in prompt or "Guten" in prompt:
        return "Hello! The post says something in Spanish/French/German. Here's an English translation: [translated text]"

    return "Sorry, I cannot answer that."


def call_llm(prompt: str) -> str:
    api_key = os.environ.get("LLM_API_KEY")
    if not api_key:
        return call_llm_stub(prompt)

    url = "https://h3oomnrg00.execute-api.eu-central-1.amazonaws.com/prod/suggest"
    data = json.dumps({"prompt": prompt}).encode("utf-8")
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }
    request = urllib.request.Request(url, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(request) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8")

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return raw

    for key in ("completion", "text", "response", "output"):
        if key in parsed:
            value = parsed[key]
            if isinstance(value, str):
                return value
            return json.dumps(value)

    return raw


def should_use_fact_check(post: str) -> bool:
    prompt = (
        "Decide whether the POST contains a real-world claim that could be checked against evidence\n"
        "(health, science, statistics, history, news) — even if it is phrased as an absolute, an\n"
        "exaggeration, or stated confidently as fact. Greetings, feelings, and pure opinions are NO.\n"
        "Reply with ONE word only: YES or NO.\n\n"
        "POST: "
        + post
    )
    response = call_llm(prompt)
    normalized = response.strip().upper()
    return normalized.startswith("YES") or normalized.split()[0] == "YES"


def is_not_english(post: str) -> bool:
    prompt = (
        "Is the POST written in English?\n"
        "Reply with ONE word only: YES or NO.\n\n"
        "POST: "
        + post
    )
    response = call_llm(prompt)
    normalized = response.strip().upper()
    return normalized.startswith("NO") or (normalized.split() and normalized.split()[0] == "NO")

FACT_CHECK = {
    "name": "fact_check",
    "instructions": (
        "When the post makes a checkable claim, reply with exactly one line "
        "ACTION: search_web(<query>) ; after you get an OBSERVATION, reply with "
        "one line FINAL: <verdict> where verdict is ✅ accurate / ⚠️ misleading / ❌ false, "
        "plus a short reason from the evidence."
    ),
    "tool": search_web,
    "trigger": should_use_fact_check,
}

TRANSLATE = {
    "name": "translate",
    "trigger": is_not_english,
    "instructions": "Reply with an English translation only.",
    "tool": None,
}

SKILLS = [FACT_CHECK, TRANSLATE]


def run_agent(context: str, post: str, tools: list) -> str:
    transcript = context + "\n\nPOST: " + post + "\nREPLY:"
    if not tools:
        return call_llm(transcript).strip()

    name_to_fn = {fn.__name__: fn for fn in tools}
    action_pattern = re.compile(r"ACTION:\s*([A-Za-z_][A-Za-z0-9_]*)\((.*)\)", re.IGNORECASE)
    final_pattern = re.compile(r"FINAL:\s*(.*)", re.IGNORECASE)

    for step in range(1, 5):
        out = call_llm(transcript)
        print(f"step {step}: {out}")

        action_match = action_pattern.search(out)
        if action_match:
            tool_name = action_match.group(1)
            arg = action_match.group(2)
            if tool_name in name_to_fn:
                result = name_to_fn[tool_name](arg.strip().strip('"\''))
                transcript += "\n" + out + "\nOBSERVATION: " + result
                continue

        final_match = final_pattern.search(out)
        if final_match:
            return final_match.group(1).strip()

        return out

    return out


def handle(post: str) -> str:
    context = SYSTEM_PROMPT
    tools = []
    for skill in SKILLS:
        if skill["trigger"](post):
            context += "\n\n" + skill["instructions"]
            if skill["tool"]:
                tools.append(skill["tool"])
            print(skill["name"], "skill: LOADED")
    print("tools available:", [t.__name__ for t in tools], "| context length:", len(context))
    return run_agent(context, post, tools)


if __name__ == "__main__":
    post_plain = "The weather is nice today."
    post_claim = "Drinking coffee\nafter 2pm\nruins your\nsleep, guaranteed."
    post_spanish = "Hola! Buenos días a todos. ¿Cómo están?"

    for label, post in [("Plain", post_plain), ("Claim", post_claim), ("Spanish", post_spanish)]:
        print(f"{label} ->")
        reply = handle(post)
        print(reply)
        print()
