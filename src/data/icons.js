import {
  FaHome,
  FaGlobe,
  FaFolder,
  FaTv,
  FaFilm,
  FaBroadcastTower,
  FaServer,
  FaBuilding,
  FaDownload,
  FaCloud,
  FaDatabase,
  FaPlayCircle,
  FaSatelliteDish,
  FaCompactDisc
} from "react-icons/fa";

import {
  MdLiveTv,
  MdMovie,
  MdStorage
} from "react-icons/md";

import {
  LuFolderArchive
} from "react-icons/lu";

export const Icons = {
  // Categories
  Fiber: FaHome,
  Dflix: FaFilm,
  LiveTV: MdLiveTv,
  Sherpur: FaBuilding,
  Universal: LuFolderArchive,
  Torrents: FaDownload,

  // Servers
  Portal: FaGlobe,
  FTP: FaFolder,
  IPTV: FaTv,
  Movies: MdMovie,
  Entertainment: FaPlayCircle,
  Live: MdLiveTv,
  CDN: FaCloud,
  Streaming: FaFilm,
  Local: FaServer,
  Archive: FaDatabase,
  Sports: FaBroadcastTower,
  Regional: FaBuilding,
  TV: MdLiveTv,
  HD: FaCompactDisc,
  Media: FaFilm,
  BD: FaGlobe,
  Tracker: FaSatelliteDish,
  Index: FaDatabase,
  KDrama: FaFilm,
  Server: MdStorage
};