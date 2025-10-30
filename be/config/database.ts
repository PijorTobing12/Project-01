/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get("DB_CONNECTION"),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MSSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MSSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i tedious
    |
    */
    mssql: {
      client: "mssql",
      connection: {
        host: Env.get("DB_HOST"),
        port: 1433,
        user: Env.get("DB_USER"),
        password: Env.get("DB_PASSWORD"),
        options: {
          instanceName: Env.get("DB_INSTANCE"),
          database: Env.get("DB_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_procsys: {
      client: "mssql",
      connection: {
        host: Env.get("DB3_HOST"),
        port: 1433,
        user: Env.get("DB3_USER"),
        password: Env.get("DB3_PASSWORD"),
        options: {
          instanceName: Env.get("DB3_INSTANCE"),
          database: Env.get("DB3_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_basys: {
      client: "mssql",
      connection: {
        host: Env.get("DB8_HOST"),
        port: 1433,
        user: Env.get("DB8_USER"),
        password: Env.get("DB8_PASSWORD"),
        options: {
          instanceName: Env.get("DB8_INSTANCE"),
          database: Env.get("DB8_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },
    
    mssql_tagihan: {
      client: "mssql",
      connection: {
        host: Env.get("DB5_HOST"),
        port: 1434,
        user: Env.get("DB5_USER"),
        password: Env.get("DB5_PASSWORD"),
        options: {
          instanceName: Env.get("DB5_INSTANCE"),
          database: Env.get("DB5_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_finsys: {
      client: "mssql",
      connection: {
        host: Env.get("DB4_HOST"),
        port: 1433,
        user: Env.get("DB4_USER"),
        password: Env.get("DB4_PASSWORD"),
        options: {
          instanceName: Env.get("DB4_INSTANCE"),
          database: Env.get("DB4_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_dbMaster: {
      client: "mssql",
      connection: {
        host: Env.get("DB1_HOST"),
        port: 1433,
        user: Env.get("DB1_USER"),
        password: Env.get("DB1_PASSWORD"),
        options: {
          instanceName: Env.get("DB1_INSTANCE"),
          database: Env.get("DB1_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_hris_ext: {
      client: "mssql",
      connection: {
        host: Env.get("DB6_HOST"),
        port: 1433,
        user: Env.get("DB6_USER"),
        password: Env.get("DB6_PASSWORD"),
        options: {
          instanceName: Env.get("DB6_INSTANCE"),
          database: Env.get("DB6_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_portal: {
      client: "mssql",
      connection: {
        host: Env.get("DB7_HOST"),
        port: 1433,
        user: Env.get("DB7_USER"),
        password: Env.get("DB7_PASSWORD"),
        options: {
          instanceName: Env.get("DB7_INSTANCE"),
          database: Env.get("DB7_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_finapp: {
      client: "mssql",
      connection: {
        host: Env.get("DB4_HOST"),
        port: 1433,
        user: Env.get("DB4_USER"),
        password: Env.get("DB4_PASSWORD"),
        options: {
          instanceName: Env.get("DB4_INSTANCE"),
          database: Env.get("DB4_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_dbcnet: {
      client: "mssql",      
        connection: {
        host: Env.get("DB_DBCNET_HOST"),
        port: Env.get("DB_DBCNET_PORT"),
        user: Env.get("DB_DBCNET_USER"),
        password: Env.get("DB_DBCNET_PASSWORD"),
        options: {
          instanceName: Env.get("DB_DBCNET_INSTANCE"),
          database: Env.get("DB_DBCNET_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_sj_paperless: {
      client: "mssql",
      connection: {
        host: Env.get("DB_SJ_PAPERLESS_HOST"),
        port: Env.get("DB_SJ_PAPERLESS_PORT"),
        user: Env.get("DB_SJ_PAPERLESS_USER"),
        password: Env.get("DB_SJ_PAPERLESS_PASSWORD"),
        options: {
          instanceName: Env.get("DB_SJ_PAPERLESS_INSTANCE"),
          database: Env.get("DB_SJ_PAPERLESS_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },

    mssql_qadweb: {
      client: "mssql",
      connection: {
        host: Env.get("DB_QADWEB_HOST"),
        port: Env.get("DB_QADWEB_PORT"),
        user: Env.get("DB_QADWEB_USER"),
        password: Env.get("DB_QADWEB_PASSWORD"),
        options: {
          instanceName: Env.get("DB_QADWEB_INSTANCE"),
          database: Env.get("DB_QADWEB_DATABASE"),
          debug: {
            packet: false,
            payload: false,
            token: false,
            data: false,
          },
        },
      },
    },
  },
};

export default databaseConfig;
