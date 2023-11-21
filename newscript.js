const newPostsContainer = document.querySelector("#newPostsContainer");
const existingPostsContainer = document.querySelector(
  "#existingPostsContainer"
);
const postForm = document.querySelector("#postForm");
const textInput = document.querySelector("#post");
const userAvatar = document.querySelector("#user-avatar");

const renderPost = (body, reactions, image, userName, container) => {
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
  likeButton.className = "like-button";
  likeButton.innerText = "❤";

  likeButton.addEventListener("click", function () {
    let currentLikes = parseInt(likeSpan.textContent) || 0;
    likeSpan.innerText = currentLikes += 1;
  });

  likeSpan.append(likeButton);
  postContainer.append(userAvatar, nameOfUser, postText, likeSpan);
  container.append(postContainer);
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

const renderNewPost = async (postData) => {
  const user = await fetchUser(postData.userId);
  renderPost(
    postData.body,
    postData.reactions,
    user.image,
    user.username,
    newPostsContainer
  );
};

const loadAndDisplayPosts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.posts.forEach(async (post) => {
      const user = await fetchUser(post.userId);
      renderPost(
        post.body,
        post.reactions,
        user.image,
        user.username,
        existingPostsContainer
      );
    });
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
  }
};

const showUserAvatar = async () => {
  const user = await fetchUser(7);
  userAvatar.src = user.image;
};
showUserAvatar();

const addPost = (postData, callback) => {
  fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (callback && typeof callback === "function") {
        callback(data);
      }
    })
    .catch((error) => console.error("Error", error));
};

postForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = await fetchUser(7);
  const newPostData = {
    body: textInput.value,
    userId: user.id,
    reactions: 0,
  };

  addPost(newPostData, (postData) => {
    renderNewPost(postData);
    textInput.value = "";
  });
});

loadAndDisplayPosts();
