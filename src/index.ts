import { ServicesManager } from "service-starter";

import MysqlDaemon from "./MySQL/MysqlDaemon";
import MysqlConnection from "./MySQL/MysqlConnection";
import MysqlHttpPlugin from "./MySQL/MysqlHttpPlugin";
import DbChangeListener from "./DbChangeListener/DbChangeListener";

class MysqlBroadcast extends ServicesManager { }

const mb = new MysqlBroadcast();

//MySQL
mb.registerService(new MysqlDaemon());
mb.registerService(new MysqlConnection());
mb.registerService(new MysqlHttpPlugin());

//表变化监听器
mb.registerService(new DbChangeListener());

mb.start();