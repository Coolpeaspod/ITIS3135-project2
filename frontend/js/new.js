"use strict";
const url = `http://localhost:3000/blogs`
const form = document.querySelector('form');
const notificationContainer = document.querySelector('.notification-container');
const notification = document.querySelector('.notification');
const closeBtn = document.querySelector('.close');
const submitBtn = document.querySelectorAll('button')[1];

submitBtn.addEventListener('click', submitNewBlog);

async function submitNewBlog(e){
    if(form.reportValidity()){
        e.preventDefault();

        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const content = form.querySelector('#content').value;

        if(title === '' && author === '' && content === ''){
            notification.textContent = 'Please fill in all of the fields';
            notificationContainer.classList.remove('hidden');
            return;
        }

        try{
            const date = new Date().toISOString();
            const profile = 'images/default.jpeg';

            const newBlog = {
                title, 
                author,
                content,
                profile,
                date,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(newBlog)
            });
            console.log(newBlog);

            if(!response.ok){
                notification.textContent = 'Failed to create a new blog. Please try again.';
                notificationContainer.classList.remove('hidden');
                throw Error (`Error ${response.url} ${response.statusText}`);
            }
            window.location.href = 'index.html';
        }
        catch(err){
            notification.textContent = err.message;
            notificationContainer.classList.remove('hidden');
        }
    } 
}

closeBtn.addEventListener('click', () => {
    notificationContainer.classList.add('hidden');
});