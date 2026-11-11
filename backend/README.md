# CS_321_Project Backend

## Technologies
Python
FastAPI
SQLite
Uvicorn
Pydantic

## Backend Setup
1. >> cd backend

2. ## Create virtual environment
    ## Windows
    >> python -m venv venv
   ## Mac/linux
    >> python3 -m venv venv

3. ## Activate virtual environment
    ## Windows
    >> .\venv\Scripts\activate
   ## Mac/linux
    >> source ./venv/bin/activate

3. ## Install dependencies
    >> pip install -r .\requirements.txt
                    or
    >> pip3 install -r .\requirements.txt

4. ## Initailize database
    >> python db.py

5. ## Start backend
    >> python main.py