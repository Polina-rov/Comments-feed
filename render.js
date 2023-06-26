import { addNewComment, fetchComments } from './comments.js';

const appEl = document.getElementById('app');
const commentForm = `
        <div class=" add-form" >
          <input type="text" id="add-form-name" class="add-form-name" readonly />
          <textarea type="textarea" id="add-form-text" class="add-form-text" placeholder="Введите ваш коментарий" rows="4">
          </textarea>
          <div class="add-form-row">
              <button class="add-form-button" id="add-form-button">Написать</button>
          </div>
        </div>
`;

const addLikes = (e, comments) => {
  const comment = comments[e.target.dataset.id];
  comment.likes++;
  comment.Isliked = true;
};

const delLikes = (e, comments) => {
  const comment = comments[e.target.dataset.id];
  comment.likes--;
  comment.Isliked = false;
};

const initLikeClick = (comments, authorized, user) => {
  const likeClickElements = document.querySelectorAll('.like-button');
  for (const likeClickElement of likeClickElements) {
    likeClickElement.addEventListener('click', (e) => {
      e.stopPropagation();
      comments[e.target.dataset.id].Isliked
        ? delLikes(e, comments)
        : addLikes(e, comments);
      renderApp(comments, false, false, authorized, false, false, user);
    });
  }
};

function commentDate(comment) {
  return comment.date
    ? comment.date
    : `${('0' + date.getDate()).slice(-2)}.${(
        '0' +
        (date.getMonth() + 1)
      ).slice(-2)}.${date.getFullYear().toString().slice(-2)} ${(
        '0' + date.getHours()
      ).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
}

function getAppHtml(
  comments,
  firstLoading,
  isLoading,
  authorized,
  login,
  isLoginMode
) {
  let resultHtml;

  if (firstLoading) {
    resultHtml = `
  <div>Пожалуйста подождите. Комментарии загружаются</div>`;
    return resultHtml;
  }

  if (login) {
    resultHtml = `
  <div class=" login-form" >
    <h3 class="auth-header">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
    ${
      isLoginMode
        ? ''
        : `<input type="text" id="name-input" class="add-form-input" placeholder="Введите ваше имя" />`
    }
    <input type="text" id="login-input" class="add-form-input" placeholder="Введите ваш логин" />
    <input type="password" id="password-input" class="add-form-input" placeholder="Введите пароль" />
    <button class="add-form-button" id="login-button">${
      isLoginMode ? 'Войти' : 'Зарегистрироваться'
    }</button>
    <button class="link" id="toggle-button">${
      !isLoginMode ? 'Войти' : 'Зарегистрироваться'
    }</button>
  </div>`;
    return resultHtml;
  }

  resultHtml = `<ul class="comments-list">${comments
    .map((comment, id) => {
      const dates = commentDate(comment);
      let Isliked;
      comment.Isliked ? (Isliked = '-active-like') : (Isliked = '');
      return `<li class="comment" data-id="${id}">
        <div class="comment-header">
          <div>${comment.name}</div>         
          <div>${dates}</div>          
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter" >${comment.likes}</span>
            <button class="like-button ${Isliked}" data-id="${id}"></button>
          </div>
        </div>
      </li>`;
    })
    .join('')}</ul>`
  if (!authorized) {
    resultHtml += `
        <div class="link3">Чтобы добавить комментарий,<button class="link2" id="autorization-button">авторизуйтесь</button></div>`;
  } else if (isLoading) {
    resultHtml += `
        <div class="add-form"> Комментарий добавляется..</div>`;
  } else {
    resultHtml += commentForm;
  }

  return resultHtml;
}

const answerComment = (commentEl) => {
  const boxCommentsTexts = document.querySelectorAll('.comment');
  boxCommentsTexts.forEach((comment) => {
    comment.addEventListener('click', () => {
      const author = comment.querySelector(
        '.comment-header div:first-child'
      ).textContent;
      const text = comment.querySelector('.comment-text').textContent;
      commentEl.value = `@${author} > ${text.trim()}, `;
    });
  });
};

function handleDisabled(commentEl, buttonEl) {
  if (commentEl.value === '') {
    buttonEl.setAttribute('disabled', 'disabled');
  } else {
    buttonEl.removeAttribute('disabled');
  }
}

function clearInputs(commentEl, buttonEl) {
  commentEl.value = '';
  buttonEl.setAttribute('disabled', 'disabled');
}

export function renderApp(
  comments,
  firstLoading = false,
  isLoading = false,
  authorized = false,
  login = false,
  isLoginMode = false,
  user
) {
  appEl.innerHTML = getAppHtml(
    comments,
    firstLoading,
    isLoading,
    authorized,
    login,
    isLoginMode
  );

  const newName = document.querySelector('#add-form-name');
  const newComment = document.querySelector('#add-form-text');
  const addButton = document.querySelector('#add-form-button');

  if (newName && newComment && addButton) {
    newName.value = user.name;

    answerComment(newComment);
    clearInputs(newComment, addButton);

    newComment.addEventListener('input', () => {
      handleDisabled(newComment, addButton);
    });
    addButton.addEventListener('click', () => {
      addNewComment(newName, newComment, user);
    });
  }

  initLikeClick(comments, authorized, user);
}

export function renderLoginComponent({ setUser, loginUser, registerUser }) {
  let isLoginMode = true;
  const listComments = [];

  const renderForm = () => {
    const appHtml = getAppHtml(
      listComments,
      false,
      false,
      false,
      true,
      isLoginMode
    );
    appEl.innerHTML = appHtml;

    document.getElementById('login-button').addEventListener('click', () => {
      const login = document.getElementById('login-input').value;
      const password = document.getElementById('password-input').value;
      if (isLoginMode) {
        if (!login) {
          alert('Введите логин');
          return;
        }
        if (!password) {
          alert('Введите пароль');
          return;
        }
        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
            fetchComments(true, user.user);
          })
          .catch((error) => {
            console.log(error);
            alert(error.message);
          });
      } else {
        const name = document.getElementById('name-input').value;
        if (!name) {
          alert('Введите имя');
          return;
        }
        if (!login) {
          alert('Введите логин');
          return;
        }
        if (!password) {
          alert('Введите пароль');
          return;
        }
        registerUser({
          login: login,
          password: password,
          name: name,
        })
          .then((user) => {
            setUser(user.user);
            fetchComments(true, user.user);
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    });

    document.getElementById('toggle-button').addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };
  renderForm();
}
