const showPosts = (body, reactions, image, userName) => {
  const postContainer = document.createElement("div");
  const userAvatar = document.createElement("img");
  const nameOfUser = document.createElement("h2");
  const postText = document.createElement("p");
  const likeSpan = document.createElement("span");
  const likeButton = document.createElement("button");
  
  postContainer.className = "root";
  userAvatar.className = "user-avatar";
  userAvatar.src = image;
  nameOfUser.className = "user-name";
  nameOfUser.innerText = userName;
  postText.className = "post-text";
  postText.innerText = body;
  likeSpan.className = "like-span";
  likeSpan.innerText = reactions;
  likeButton.innerText = "❤";
  
  likeButton.addEventListener("click", function () {
    let currentLikes = parseInt(likeSpan.textContent) || 0;
    likeSpan.innerText = currentLikes += 1;
  });

  likeSpan.append(likeButton)
  postContainer.append(userAvatar, nameOfUser, postText, likeSpan);
  
};

const fetchUser = async (userId) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
  }
};

const fetchPosts = async () => {
  try {
    const response = await fetch('https://dummyjson.com/posts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
  }
};

fetchPosts().then(async (posts) => {
  if (posts) {
    for (const post of posts) {
      const user = await fetchUser(post.userId);
      showPosts(post.body, post.reactions, post.image, user.name);
    }
  }
});

const addPost = (postData) => {
  fetch('https://dummyjson.com/posts/add', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error", error));
};

const postForm = document.querySelector("#postForm");
const textInput = document.querySelector('#post')
const userAvatar = document.querySelector("#user-avatar");


postForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = await fetchUser(27);
  userAvatar.src = user.image;
  
  const newPost = {
    body: textInput.value,
    userId: user.id,
  };

  addPost(newPost, (postData, userData) => showPosts(postData, userData));
  
});

