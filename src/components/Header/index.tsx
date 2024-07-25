import React from "react";
import Connect from "../Connect";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return <header className="App-header">
        <div className="w-[1180px] flex justify-between font-sora-700 text-gradient md:text-[30px] text-[16px]">
            <span className="hover:cursor-pointer" onClick={() => { navigate('/plawar-web') }}>PlaWar : WarFront</span>
            <span className="hover:cursor-pointer" onClick={() => { navigate('/plawar-web/mypage') }}>MyPage</span>
            <Connect />
        </div>
    </header>
}
export default Header;