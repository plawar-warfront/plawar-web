import { Route, Routes, useLocation } from 'react-router-dom';
import MyPage from './components/MyPage';
import SubtitlePage from './components/SubtitlePage';
import Game from './components/Game';

const App = () => {
  const loc = useLocation();
  return <>
    <Game classNames={loc.pathname !== "/plawar-web" ? "hidden" : ""} />
    <Routes>
      <Route path="/plawar-web" element={<></>} />
      <Route path="/plawar-web/mypage" element={<MyPage />} />
      <Route path="/plawar-web/setsubtitle" element={<SubtitlePage />} />
    </Routes>
  </>
}

export default App