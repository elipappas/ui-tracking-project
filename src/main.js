import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

const username = "user-name";

document.getElementById("user-name").textContent = username;

export default app
