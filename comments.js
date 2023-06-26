import { getApi, postComment } from './api.js';
import { renderApp, renderLoginComponent } from './render.js';

let comments = [];

export async function addNewComment(newName, newComment, user) {
  const shortName = newName.value;
  const shortComment = newComment.value;
  renderApp(comments, false, true, true, false, false, user);

  postComment(
    {
      text: newComment.value,
      name: newName.value,
    },
    user.token
  )
    .then(() => {
      fetchComments(true, user);
    })
    .catch((e) => {
      newName.value = shortName;
      newComment.value = shortComment;
    });
}

export async function fetchComments(
  authorized = false,
  user,
  isFirstLoading = false,
  authorizationButtonListener
) {
  if (isFirstLoading) {
    renderApp([], true, false, authorized, false, false, user);
  }
  const response = await getApi();
  comments = response;
  renderApp(response, false, false, authorized, false, false, user);
  if (!user?.token) {
    authorizationButtonListener();
  }
}
