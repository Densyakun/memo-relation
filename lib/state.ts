import { proxy } from 'valtio';
import { MemoData } from './type';

const appState = proxy<{
  page: number;
  memos?: MemoData[];
  isLoading: boolean;
  error?: Error;
}>({
  page: 1,
  isLoading: true,
});

export default appState;