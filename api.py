
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import predictor
import os

app = FastAPI(title="InfraSense Severity API", version="1.0")

# Enable CORS for Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "InfraSense AI Service is Running"}

@app.post("/predict")
async def predict_severity(
    text: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        # Read image bytes directly (no need to save to disk)
        image_bytes = await image.read()
        
        result = predictor.predict_final(text, image_bytes)
        
        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8890))
    uvicorn.run(app, host="0.0.0.0", port=port)
