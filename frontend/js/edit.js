"use strict";
const id = new URLSearchParams(window.location.search).get('id');
console.log(id);

let blog;
const url = `http://localhost:3000/blogs/${id}`;

const form = document.querySelector('form');
const titleBox = form.querySelector('#title');
const contentBox = form.querySelector('#content');
const submitBtn = form.querySelector('button');
const notificationContainer = document.querySelector('.notification-container');
const notification = document.querySelector('.notification');
const closeBtn = document.querySelector('.close');

window.addEventListener('DOMContentLoaded', fetchBlog);

async function fetchBlog(){

    try{
        const response = await fetch(url);
        if(!response.ok){
            throw Error (`Error ${response.url} ${response.statusText}`);
        }
    
        blog = await response.json();
        populate();
    }
    catch(err){
        notification.textContent = err.message;
        notificationContainer.classList.remove('hidden');
    }
}

function populate(){
    if(blog){
        titleBox.value = blog.title;
        contentBox.value = blog.content;
    }
    else{
        notification.textContent = 'Blog data is empty';
        notificationContainer.classList.remove('hidden');
    }
}

closeBtn.addEventListener('click', () => {
    notificationContainer.classList.add('hidden');
});

submitBtn.addEventListener('click', updateBlog);

async function updateBlog(e){
    if(form.reportValidity()){
        e.preventDefault();
        blog.title = titleBox.value;
        blog.content = contentBox.value;

        try{
            const response = await fetch (url, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(blog)
            });

            if(!response.ok){
                notification.textContent = 'Unable to update blog';
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

