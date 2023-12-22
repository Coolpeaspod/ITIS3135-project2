"use strict";
const id = new URLSearchParams(window.location.search).get('id');
// console.log(id);

let blog;
const articlesWrapper = document.querySelector('.wrapper');
const url = `http://localhost:3000/blogs/${id}`;
const notificationContainer = document.querySelector(".notification-container");
const notification = document.querySelector(".notification");
const closeBtn = document.querySelector(".close");

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
        notificationContainer.classList.remove("hidden");
    }
}

function populate(){
    const article = document.createElement('article');
    article.classList.add('wrapper');

    const title = document.createElement('h2');
    title.textContent = blog.title;
    article.appendChild(title);

    const articleHeader = document.createElement('div');
    articleHeader.classList.add('article-header');

    const avatar = document.createElement('img');
    avatar.src = `${blog.profile}`;
    avatar.alt = 'profile picture';
    avatar.width = '60';
    avatar.height = '60';
    avatar.classList.add('avatar');
    articleHeader.appendChild(avatar);

    const metadata = document.createElement('div');
    const date = new Date(blog.date);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    metadata.textContent = `${blog.author} • ${date.toLocaleDateString(undefined, options)}`;
    articleHeader.appendChild(metadata);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    const editLink = document.createElement('a');
    editLink.classList.add('btn');
    editLink.href = `edit.html?id=${blog.id}`;
    editLink.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    btnContainer.appendChild(editLink);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn');
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.addEventListener('click', async () => {
        await deleteBlog(blog.id)
    });
    btnContainer.appendChild(deleteBtn);

    articleHeader.appendChild(btnContainer);
    article.appendChild(articleHeader);

    const articleBody = document.createElement('p');
    articleBody.classList.add('article-body');
    articleBody.textContent = blog.content;
    article.appendChild(articleBody);

    document.querySelector('.wrapper').appendChild(article);
}

async function deleteBlog(id){
    const response = await fetch(url, {
        method: 'DELETE'
    });
    window.location.href = 'index.html';

    if(!response.ok){
        throw Error (`Error ${response.url} ${response.statusText}`);
    }
    let index = blog.findIndex(element => element.id === id);
    if(index !== -1){
        blog.splice(index, 1);
    }
}

closeBtn.addEventListener("click", () => {
    notificationContainer.classList.add("hidden");
  });