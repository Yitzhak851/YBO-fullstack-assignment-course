# my-YBO-app/backend/app/services/users_service.py

from app.utils.db import Database
from app.models import User


class UsersService:
    """Service for managing users"""
    
    @staticmethod
    def fetch_users(start=0, limit=10, search=""):
        """Fetch users with optional search"""
        sql = """
            SELECT id, email, name, bio, profile_picture, created_at
            FROM users
        """
        params = []
        
        if search:
            sql += " WHERE name LIKE %s OR email LIKE %s"
            search_term = f"%{search}%"
            params.extend([search_term, search_term])
        
        sql += " LIMIT %s OFFSET %s"
        params.extend([limit, start])
        
        try:
            users = Database.execute_query(sql, params)
            return {
                'success': True,
                'users': users
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        try:
            user = Database.execute_query(
                """
                SELECT id, email, name, bio, profile_picture, created_at
                FROM users
                WHERE id = %s
                """,
                (user_id,),
                fetch_one=True
            )
            
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }
            
            return {
                'success': True,
                'user': user
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def get_user_follow_stats(user_id):
        """Get follow statistics for a user"""
        try:
            # Count followers
            followers_result = Database.execute_query(
                "SELECT COUNT(*) as count FROM follows WHERE following_id = %s",
                (user_id,),
                fetch_one=True
            )
            followers_count = followers_result['count'] if followers_result and 'count' in followers_result else 0
            
            # Count following
            following_result = Database.execute_query(
                "SELECT COUNT(*) as count FROM follows WHERE follower_id = %s",
                (user_id,),
                fetch_one=True
            )
            following_count = following_result['count'] if following_result and 'count' in following_result else 0
            
            # Count posts
            posts_result = Database.execute_query(
                "SELECT COUNT(*) as count FROM posts WHERE user_id = %s",
                (user_id,),
                fetch_one=True
            )
            posts_count = posts_result['count'] if posts_result and 'count' in posts_result else 0
            
            return {
                'success': True,
                'followers': followers_count,
                'following': following_count,
                'posts': posts_count
            }
        except Exception as e:
            print(f"Error in get_user_follow_stats: {str(e)}")  # For debugging
            return {
                'success': False,
                'error': str(e)
            }