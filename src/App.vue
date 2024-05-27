<template>
<div id="app">
  <div class="routerView">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</div>
  
</template>

<script>
  export default {
    methods: {
      scaleCorner(to) {
        this.$refs.gitCorner.style.transform = "scale(" + to + ") rotate(-45deg)";
      }
    }
  };
</script>

<style>
  #app {
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    border-radius: 4px;
  }
  .nav {
    box-sizing: border-box;
    height: 48px;
    line-height: 48px;
    position: sticky;
    top: 0;
    z-index: 108;
    display: grid;
    grid-template-columns: 1fr 0.001fr 1fr;
    grid-template-rows: 1fr 0px;
    grid-auto-rows: minmax(0, min-content);
    margin-top: 5px;
    grid-gap: 5px;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  a > .link {
    display: grid;
    text-decoration: none;
    box-sizing: border-box;
    overflow: hidden;
    height: 48px;
    cursor: pointer;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    font-weight: 700;
    padding: 8px 10px;
    border-bottom: 3px solid rgba(204, 212, 216, 0.8);
    color: #92b1b3;
    transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
  }
  .link > span {
    align-self: center;
  }
  a > .link.active {
    color: rgba(42, 94, 190, 0.8);
    border-bottom: 3px solid rgba(42, 94, 190, 0.8);
  }
  a > .link:hover {
    color: rgba(42, 94, 190, 0.8);
    border-bottom: 3px solid rgba(42, 94, 190, 0.8);
  }
  .upperDot {
    align-self: end;
    font-size: 22px;
    margin-bottom: -10px;
    color: #c2c6cc;
  }
  .routerView {
    margin-top: 10px;
    height: auto;
  }
  .github-corner {
    width: 5px;
    grid-column: 2/4;
    margin-top: -42.9px;
    margin-left: -33.1px;
  }
  .github-corner > svg {
    pointer-events: none;
    backface-visibility: hidden;
    margin-top: 3px;
    transform: scale(1.4) rotate(-45deg);
    transition: all .1s linear;
    -moz-transition: all .1s linear;
    -webkit-transition: all .1s linear;
  }
  .github-cornerBody {
    pointer-events: all;
    cursor: pointer;
  }
  .github-cornerBody:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
  @keyframes octocat-wave {
    0%,
    100% {
      transform: rotate(0);
    }
    20%,
    60% {
      transform: rotate(-25deg);
    }
    40%,
    80% {
      transform: rotate(10deg);
    }
  }
  @media (max-width: 500px) {
    .github-cornerBody:hover .octo-arm {
      animation: none;
    }
    .github-cornerBody .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
  }
</style>
