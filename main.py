from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# 1. 정적 파일(CSS, JS, 이미지) 경로 연결 (제일 중요!)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 2. HTML 템플릿 경로 연결
templates = Jinja2Templates(directory="templates")

# --- 페이지 접속 경로 설정 ---

# landing page
@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

# 메인 페이지 (주소창에 그냥 localhost:8000 쳤을 때)
@app.get("/main.html")
async def read_main(request: Request):
    # 님 파일명이 main.html 이라서 이렇게 적음!
    return templates.TemplateResponse("main.html", {"request": request})

# 마이 페이지
@app.get("/mypage.html")
async def read_mypage(request: Request):
    return templates.TemplateResponse("mypage.html", {"request": request})

# 어바웃 페이지
@app.get("/about.html")
async def read_about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

# [추가] 전체 정책 모아보기 (핀터레스트 스타일)
@app.get("/all.html")
async def read_all_policies(request: Request):
    return templates.TemplateResponse("all.html", {"request": request})