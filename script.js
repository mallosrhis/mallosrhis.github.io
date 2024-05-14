document.addEventListener('DOMContentLoaded', function() {
  const gameList = document.querySelector('.game-list');

  // Function to create game list item
  function createGameListItem(game) {
    const listItem = document.createElement('li');

    const gameCover = document.createElement('div');
    gameCover.classList.add('game-cover');

    const coverImage = document.createElement('img');
    coverImage.src = game.coverImage;
    coverImage.alt = `${game.title} Cover`;
    coverImage.dataset.modalTarget = `modal-${game.title.replace(/\s+/g, '').toLowerCase()}`;

    gameCover.appendChild(coverImage);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = `modal-${game.title.replace(/\s+/g, '').toLowerCase()}`;

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = '×';

    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });

    const modalCoverImage = document.createElement('img');
    modalCoverImage.src = game.coverImage;
    modalCoverImage.alt = `${game.title} Cover`;

    const modalDescription = document.createElement('p');
    modalDescription.textContent = game.description;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalCoverImage);
    modalContent.appendChild(modalDescription);
    modal.appendChild(modalContent);

    listItem.appendChild(gameCover);
    listItem.appendChild(modal);

    return listItem;
  }

  // Fetch game data from games.json
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      // Dynamically generate game list
      data.forEach(game => {
        const listItem = createGameListItem(game);
        gameList.appendChild(listItem);
      });

      // Add event listener to open modal when game cover is clicked
      const modalTriggerElements = document.querySelectorAll('[data-modal-target]');
      modalTriggerElements.forEach(function(element) {
        element.addEventListener('click', function() {
          const target = this.getAttribute('data-modal-target');
          const modal = document.getElementById(target);
          modal.style.display = 'block';
        });
      });
    });
});
