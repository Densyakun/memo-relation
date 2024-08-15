import { proxy } from 'valtio';

const appState = proxy<{
  page: number;
}>({
  page: 1,
});

export default appState;