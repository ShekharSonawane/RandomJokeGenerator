// script.js - Random Joke Generator using icanhazdadjoke API
const jokeText = document.getElementById('joke-text');
const newJokeBtn = document.getElementById('new-joke');
const shareBtn = document.getElementById('share-joke');
const statusEl = document.getElementById('status');

const API_URL = 'https://icanhazdadjoke.com/';

async function fetchJoke() {
  setLoading(true);
  statusEl.textContent = 'Loading joke...';
  try {
    const res = await fetch(API_URL, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Random-Joke-Generator (https://github.com/ShekharSonawane/RandomJokeGenerator)'
      }
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    showJoke(data.joke);
    statusEl.textContent = '';
  } catch (err) {
    console.error(err);
    showJoke('Oops — could not fetch a joke. Try again.');
    statusEl.textContent = 'Failed to load. You can try again.';
  } finally {
    setLoading(false);
  }
}

function showJoke(text) {
  jokeText.textContent = text;
  // store current joke on the button dataset for sharing
  shareBtn.dataset.joke = text;
}

function setLoading(isLoading) {
  newJokeBtn.disabled = isLoading;
  shareBtn.disabled = isLoading;
  if (isLoading) {
    newJokeBtn.textContent = 'Loading...';
  } else {
    newJokeBtn.textContent = 'New Joke';
  }
}

async function shareJoke() {
  const joke = shareBtn.dataset.joke || jokeText.textContent;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Joke for you',
        text: joke
      });
    } catch (err) {
      // user cancelled or share failed
      console.log('Share canceled or failed', err);
    }
  } else {
    // fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(joke);
      statusEl.textContent = 'Joke copied to clipboard!';
      setTimeout(()=> statusEl.textContent = '', 2000);
    } catch (err) {
      statusEl.textContent = 'Sharing not supported on this device.';
    }
  }
}

newJokeBtn.addEventListener('click', fetchJoke);
shareBtn.addEventListener('click', shareJoke);

// Fetch an initial joke on load
fetchJoke();