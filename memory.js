$(document).ready(function () {
  // Constants
  const imagesArray = [
    "card_1.png",
    "card_2.png",
    "card_3.png",
    "card_4.png",
    "card_5.png",
    "card_6.png",
    "card_7.png",
    "card_8.png",
    "card_9.png",
    "card_10.png",
    "card_11.png",
    "card_12.png",
    "card_13.png",
    "card_14.png",
    "card_15.png",
    "card_16.png",
    "card_17.png",
    "card_18.png",
    "card_19.png",
    "card_20.png",
    "card_21.png",
    "card_22.png",
    "card_23.png",
    "card_24.png",
  ];

  // Game variables
  let cards = [];
  let numCards = 48; // Default number of cards
  let player = "";
  let highScore = localStorage.getItem("highScore") || 0;
  let correctCount = 0;
  let tries = 0;

  $("#tabs").tabs();

  // Load images and start the game
  function startGame() {
    loadImages();
    generateCards();
    setupEventHandlers();
    updateUI();
  }

  // Load images
  function loadImages() {
    // Shuffle the images array
    shuffleArray(imagesArray);

    // Get the required number of images
    const numImages = numCards / 2;
    const selectedImages = imagesArray.slice(0, numImages);

    // Duplicate and shuffle the selected images
    const imagePairs = selectedImages.concat(selectedImages);
    shuffleArray(imagePairs);

    // Set the card images
    cards = imagePairs.map((image) => ({
      src: "images/" + image,
      matched: false,
      selected: false,
    }));
  }

  // Generate the game cards
  function generateCards() {
    const $cardsContainer = $("#cards");
    $cardsContainer.empty();

    const numCardsPerRow = 8;
    const numRows = numCards / numCardsPerRow;

    for (let row = 0; row < numRows; row++) {
      const $row = $("<div>").addClass("card-row");
      $cardsContainer.append($row);

      for (let col = 0; col < numCardsPerRow; col++) {
        const cardIndex = row * numCardsPerRow + col;
        const card = {
          src: cards[cardIndex].src,
          matched: false,
          selected: false,
        };

        const $card = $("<a>", { href: "#" })
          .addClass("card")
          .data("card", card)
          .append($("<img>", { src: "images/back.png", alt: "" }));

        $row.append($card);
      }
    }
  }

  // Setup event handlers
  function setupEventHandlers() {
    const $cardsContainer = $("#cards");

    $cardsContainer.on("click", ".card", handleCardClick);
    $("#save_settings").on("click", saveSettings);
    $("#new_game a").on("click", startNewGame);
  }

  // Handle card click event
  function handleCardClick() {
    const $card = $(this);
    const card = $card.data("card");

    if (card.matched || card.selected) {
      return; // Ignore already matched or selected cards
    }

    card.selected = true;
    $card.find("img").attr("src", card.src);

    const selectedCards = $(".card").filter(function () {
      const cardData = $(this).data("card");
      return cardData.selected;
    });

    if (selectedCards.length === 2) {
      $(".card").off("click"); // Disable further clicks
      setTimeout(() => checkCardMatch(selectedCards), 1000);
    }
  }

  // Check if the selected cards match
  function checkCardMatch(selectedCards) {
    const card1 = $(selectedCards[0]).data("card");
    const card2 = $(selectedCards[1]).data("card");

    if (card1.src === card2.src) {
      card1.matched = true;
      card2.matched = true;
      correctCount++;
      updateHighScore();

      if (correctCount === numCards / 2) {
        endGame();
      } else {
        setTimeout(() => {
          hideCards(selectedCards);
          $(".card").on("click", handleCardClick); // Re-enable card clicks
        }, 1000);
      }
    } else {
      card1.selected = false;
      card2.selected = false;
      card1.fadeOutAndIn = true;
      card2.fadeOutAndIn = true;

      setTimeout(() => {
        fadeOutAndInCards(selectedCards);
      }, 2000);
    }

    tries++;
    updateUI();
  }

  // Hide matching cards with sliding motion
  function hideCards(selectedCards) {
    selectedCards.slideUp(500, function () {
      $(this).remove();
    });
  }

  //Fade out non-matching cards and fade in the back of the cards
  function fadeOutAndInCards(selectedCards) {
    selectedCards.find("img").fadeOut(500);

    setTimeout(() => {
      selectedCards.find("img").fadeIn(500).attr("src", "images/back.png");
      $(".card").on("click", handleCardClick); // Re-enable card clicks
    }, 2000);
  }

  // End the game
  function endGame() {
    $(".card").off("click"); // Disable further card clicks
    updateHighScore();
    updateUI();

    const score = Math.round((correctCount / (numCards / 2)) * 100);
    let message = `Congratulations, ${player}! You completed the game with a score of ${score}%.`;
    if (score === 100) {
      message += " Perfect!";
    }
    alert(message);

    correctCount = 0;
    updateUI();
  }

  // Save settings and start a new game
  function saveSettings() {
    player = $("#player_name").val();
    numCards = parseInt($("#num_cards").val());
    sessionStorage.setItem("playerName", player);
    sessionStorage.setItem("numCards", numCards);
    location.reload();
  }

  // Start a new game
  function startNewGame() {
    correctCount = 0;
    startGame();
  }

  // Update the high score
  function updateHighScore() {
    if (correctCount > highScore) {
      highScore = correctCount;
      localStorage.setItem("highScore", highScore);
    }
  }

  // Update the UI
  function updateUI() {
    $("#player").text(`Player: ${player}`);
    $("#high_score").text(`High Score: ${highScore}%`);
    $("#correct").text(`Correct: ${correctCount}/${numCards / 2}`);
  }

  // Helper function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Initialize game settings and start the game
  function initializeSettings() {
    player = sessionStorage.getItem("playerName") || "";
    numCards = parseInt(sessionStorage.getItem("numCards")) || 48;
    $("#player_name").val(player);
    $("#num_cards").val(numCards);
  }

  initializeSettings();
  startGame();
});
