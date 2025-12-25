from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat_with_gemini(request: ChatRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API Key is not configured."
        )

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Add some context to the prompt
        system_context = """
        You are a smart nutrition assistant. 
        If the user asks about food nutrition, return a JSON object ONLY with no markdown formatting:
        {"calories": int, "protein": int, "carbs": int, "fats": int}
        Values should be per 100g or per serving as implied.
        If the user asks a general question, just answer normally in plain text.
        """
        full_prompt = f"{system_context}\n\nUser: {request.message}\nAssistant:"
        
        response = model.generate_content(full_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with AI service: {str(e)}"
        )
