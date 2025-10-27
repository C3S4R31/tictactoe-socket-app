import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Lobby from './views/Lobby';
import RoomList from './views/RoomList';
import Game from './views/Game';
import GameOnline from './views/GameOnline';
import Admin from './views/Admin';

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<Lobby />} index />
                    <Route path='/rooms' element={<RoomList />} />
                    <Route path='/game' element={<Game />} />
                    <Route path='/gameOnline' element={<GameOnline />} />
                    <Route path='/admin' element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )

}