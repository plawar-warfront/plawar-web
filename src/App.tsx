import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyPage from './components/MyPage';
import SubtitlePage from './components/SubtitlePage';
import Game from './components/Game';

const App = () => {
    return         <BrowserRouter>
    <Routes>
      <Route path="/plawar-web" element={<Game />} />
      <Route path="/plawar-web/mypage" element={<MyPage />} />
      <Route path="/plawar-web/setsubtitle" element={<SubtitlePage />} />
    </Routes>
  </BrowserRouter>
}

export default App