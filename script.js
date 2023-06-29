import { fetchComments } from './comments.js';
import { loginUser, registerUser } from './api.js';
import { renderLoginComponent } from './render.js';

let user = null;

const authorizationButtonListener = () => {
  const authorizationButtonElement = document.getElementById(
    'autorization-button'
  );

  authorizationButtonElement.addEventListener('click', () => {
    renderLoginComponent({
      setUser: (newUser) => {
        user = newUser;
        localStorage.setItem('user', JSON.stringify(user));
      },
      loginUser,
      registerUser,
    });
  });
};

function init() {
  user = JSON.parse(localStorage.getItem('user'));
  fetchComments(Boolean(user), user, true, authorizationButtonListener);
}

init();
