Learning Management System
Backend: Django Rest Framework (DRF)
Frontend: NextJS
 
Functional Requirements
    The application must support two user roles:
        Instructor
        Student
 
Instructor Capabilities
    Create and manage courses.
    Create chapters within a course.
    Use Plate.js as the text editor for creating and editing chapter content.
    Set the visibility of each chapter (e.g., mark as public or private).
 
Student Capabilities
    View a list of available courses.
    Join a course created by an instructor.
    Access and read chapters that have been marked as public by the instructor.


Front-End setup:
npx create-next-app@latest . --use-npm --no-tailwind --eslint
npm run dev 


Back-End setup
python -m pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python -m django startproject core .    #this will create manage.py 
python manage.py startapp api          #creates api

python manage.py makemigrations #make changes


python manage.py runserver 8000