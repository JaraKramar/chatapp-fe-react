// import { faker } from "@faker-js/faker";
import {
  ChatCircleDots,
  GearSix,
  SignOut,
} from "phosphor-react";

const Profile_Menu = [
  // {
  //   title: "Profile",
  //   icon: <User />,
  // },
  // {
  //   title: "Settings",
  //   icon: <Gear />,
  // },
  {
    title: "Logout",
    icon: <SignOut />,
  },
];

const model_options = [
  // {
  //   title: "Profile",
  //   icon: <User />,
  // },
  // {
  //   title: "Settings",
  //   icon: <Gear />,
  // },
  {
    id: 0,
    label: "haiku",
    value: 'haiku'
  },
  {
    id: 1,
    label: "sonnet",
    value: 'sonnet'
  },
  {
    id: 2,
    label: "haiku and sonnet",
    value: 'haiku and sonnet'
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
  },
  // {
  //   index: 1,
  //   icon: <Users />,
  // },
  // {
  //   index: 2,
  //   icon: <Phone />,
  // },
];

const Nav_Setting = [
  {
    index: 3,
    icon: <GearSix />,
  },
];

const Message_options = [
  // {
  //   title: "Reply",
  // },
  // {
  //   title: "React to message",
  // },
  // {
  //   title: "Forward message",
  // },
  // {
  //   title: "Star message",
  // },
  // {
  //   title: "Report",
  // },
  {
    title: "Feedback",
  },
];

export {
  Profile_Menu,
  Nav_Setting,
  Nav_Buttons,
  Message_options,
  model_options
};
