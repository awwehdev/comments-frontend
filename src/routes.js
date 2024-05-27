import FullScreen from './components/FullScreen.vue';

export const routes = [
  {
    path: '/', components: {
      default: FullScreen,
    }
  },
  { path: '*', redirect: '/' }
];
