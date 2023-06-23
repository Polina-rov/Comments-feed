const commentList = document.querySelector('.comments');

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

const initLikeClick = (comments) => {
  const likeClickElements = document.querySelectorAll('.like-button');
  for (const likeClickElement of likeClickElements) {
    likeClickElement.addEventListener('click', (e) => {
      e.stopPropagation();
      comments[e.target.dataset.id].Isliked
        ? delLikes(e, comments)
        : addLikes(e, comments);
      renderComments(comments);
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

export function renderComments(comments) {
  const commentHtmlResult = comments
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
    .join('');
  commentList.innerHTML = commentHtmlResult;
  initLikeClick(comments);
}
