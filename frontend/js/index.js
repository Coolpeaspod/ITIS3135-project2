"use strict";
const MAX_LENGTH = 50; //maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12; //number of blogs per page

const url = "http://localhost:3000/blogs";
// const url1 = "http://localhost:3000/blogs?_sort=date&_order=desc";
let blogs = [];
let filteredBlogs = [];
const articlesWrapper = document.querySelector(".articles-wrapper");
const paginationContainer = document.querySelector(".pagination-container");
const searchInput = document.querySelector('.search-bar input[type="search"]');
const notificationContainer = document.querySelector(".notification-container");
const notification = document.querySelector(".notification");
const closeBtn = document.querySelector(".close");

window.addEventListener("DOMContentLoaded", fetchBlogs());

async function fetchBlogs() {
  const response = await fetch(`${url}?_sort=date&_order=desc`);
  try {
    if (!response.ok) {
      throw Error(`Error ${response.url} ${response.statusText}`);
    }

    blogs = await response.json();
    console.log(blogs);
    loadPagination();
    loadBlogs(1);
  } catch (err) {
    notification.textContent = err.message;
    notificationContainer.classList.remove("hidden");
    closeBtn.addEventListener("click", () => {
      notificationContainer.classList.add("hidden");
    });
    console.log(err.message);
  }
}

function loadBlogs(pageNumber) {
  const startIndex = (pageNumber - 1) * PAGE_LIMIT;
  const endIndex = startIndex + PAGE_LIMIT;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();
  currentBlogs.forEach((blog) => fragment.append(generateBlog(blog)));
  articlesWrapper.innerHTML = "";
  articlesWrapper.append(fragment);
}

function loadBlogsFiltered(pageNumber) {
  const startIndex = (pageNumber - 1) * PAGE_LIMIT;
  const endIndex = startIndex + PAGE_LIMIT;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();
  currentBlogs.forEach((blog) => fragment.append(generateBlog(blog)));
  articlesWrapper.innerHTML = "";
  articlesWrapper.append(fragment);
}

function generateBlog(blog) {
  const article = document.createElement("article");
  article.classList.add("card");

  const header = document.createElement("div");
  header.classList.add("card-header");

  const avatar = document.createElement("img");
  avatar.src = `${blog.profile}`;
  avatar.width = "60";
  avatar.height = "60";
  avatar.alt = "profile picture";
  avatar.classList.add("avatar");

  const date = new Date(blog.date);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString(undefined, options);

  const metadata = document.createElement("div");
  metadata.textContent = `${blog.author} • ${formattedDate}`;

  header.appendChild(avatar);
  header.appendChild(metadata);

  const body = document.createElement("div");
  body.classList.add("card-body");

  const title = document.createElement("h3");
  title.textContent = blog.title;

  const content = document.createElement("p");
  content.textContent =
    blog.content.length > MAX_LENGTH
      ? blog.content.substring(0, MAX_LENGTH) + "..."
      : blog.content;

  body.appendChild(title);
  body.appendChild(content);

  article.appendChild(header);
  article.appendChild(body);

  article.addEventListener("click", () => {
    window.location.href = `details.html?id=${blog.id}`;
  });

  return article;
}

function loadPagination() {
  const totalPages = Math.ceil(blogs.length / PAGE_LIMIT);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("page-btn");

    button.addEventListener("click", () => {
      const activeButton = document.querySelector(".page-btn.active");
      if (activeButton) {
        activeButton.classList.remove("active");
      }
      button.classList.add("active");
      loadBlogs(i);
    });
    paginationContainer.appendChild(button);
  }

  const firstButton = document.querySelector(".page-btn");
  if (firstButton) {
    firstButton.classList.add("active");
  }
}

searchInput.addEventListener("change", search);

async function search(e) {
  const searchTerm = e.target.value.trim();
  console.log(searchTerm);

  try {
    let filteredURL = `${url}?_page=1&_limit=${PAGE_LIMIT}`;
    if(searchTerm !== ''){
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      filteredURL += `&q=${encodedSearchTerm}`;
    }
    else{
      filteredURL = `${url}?_sort=date&_order=desc`;
    }

    const response = await fetch(filteredURL);
    if (!response.ok) {
      throw new Error(`Error: ${response.url} ${response.statusText}`);
    }

    filteredBlogs = await response.json();
    console.log(filteredBlogs);
    loadBlogsFiltered(1);
 
  } catch (err) {
    notification.textContent = err.message;
    notificationContainer.classList.remove("hidden");
  }
}

closeBtn.addEventListener("click", () => {
  notificationContainer.classList.add("hidden");
});
