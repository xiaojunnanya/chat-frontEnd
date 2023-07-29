import React, { Suspense, useState } from 'react';
import {
  CommentOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { HomeStyled } from './style';

import { useAppDispatch } from '@/store';
import { fetchSelfInfo } from '@/store/modules/home';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?:String
): MenuItem {
  return {
    label,
    key,
    icon,
    path
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('消息', '/home/chat', <CommentOutlined />),
  getItem('联系人', '/home/friend', <UsergroupAddOutlined />),
  getItem('我的', '/home/me', <SettingOutlined />),
  getItem('共享画板', '/home/canvas', <SettingOutlined />),
];


const Home: React.FC = () => {

  const [ defaultSelectedKeys, setDefaultSelectedKeys ] = useState(['/home/chat'])

  // 仓库发送网络请求
  const dispatch = useAppDispatch()
  dispatch(fetchSelfInfo())
    
  const navigate = useNavigate()
  const showComp = (e: any) =>{
    navigate(e.key)
  }

  // const loaction = useLocation()
  // console.log(loaction.pathname)
  
  // useEffect(()=>{
  //   let a = [loaction.pathname]
  //   navigate(loaction.pathname)
  //   setDefaultSelectedKeys(a)
  // },[loaction.pathname])

  // console.log(defaultSelectedKeys);

  return (
    <HomeStyled>
      <div className='menu'>
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
          mode="inline"
          theme="dark"
          items={items}
          onClick={(e)=>{showComp(e)}}
        >
        </Menu>
      </div>
      <Suspense fallback=''>
        <div className="con">
            <Outlet></Outlet>
        </div>
      </Suspense>
      
    </HomeStyled>
  );
};

export default Home;