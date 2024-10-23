// import { faker } from "@faker-js/faker";
import {
  ChatCircleDots,
  GearSix,
  SignOut,
} from "phosphor-react";

const Profile_Menu = [
  {
    title: "Logout",
    icon: <SignOut />,
  },
];

const model_options = [
  {
    id: 0,
    label: "Haiku",
    value: 'haiku',
    desc: "(sufficiently high-quality outputs, fastest response time)"
  },
  {
    id: 1,
    label: "Sonnet3.5",
    value: 'sonnet3.5',
    desc: "(highest quality outputs, medium response time (currently limited to approx. 20 queries/minute))"
  },
  {
    id: 2,
    label: "Sonnet",
    value: 'sonnet',
    desc: "(quality outputs, slowest response time)"
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
    path: '/app'
  },
  {
    index: 1,
    icon: <GearSix />,
    path: '/settings'
  },
];

export {
  Profile_Menu,
  Nav_Buttons,
  model_options
};
