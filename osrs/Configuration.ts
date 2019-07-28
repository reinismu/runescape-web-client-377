export class Configuration {

    /**
     * IP Address or Hostname of the server to establish a connection.
     */
    public static SERVER_ADDRESS: string = "127.0.0.1";

    /**
     * Name of the cache folder located in the users home directory.
     */
    public static CACHE_NAME: string = ".377cache";

    /**
     * Port for establishing a connection to the game server.
     */
    public static GAME_PORT: number = 43594;

    /**
     * Port for establishing a connection to the update server.
     */
    public static JAGGRAB_PORT: number = 43595;

    /**
     * Port for establishing a backup connection to the update
     * server in case the initial JAGGRAB connection fails.
     */
    public static HTTP_PORT: number = 8080;

    /**
     * Whether or not the update server should be used.
     */
    public static JAGGRAB_ENABLED: boolean = true;

    /**
     * Whether or not the network packets should be encrypted.
     */
    public static RSA_ENABLED: boolean = true;

    /**
     * Public key to be used in RSA network encryption.
     */
    public static RSA_PUBLIC_KEY: BigInt = BigInt("65537");
    /**
     * Modulus to be used in the RSA network encryption.
     */
    public static RSA_MODULUS: BigInt = BigInt("119451785246034594318913466844897726485032978021771870857253652593456459656937408149171663305729099294408934560892059864142824573680823430259445420145626640471963783539799807337723403799309811004289973658204797289344515940319017904707123481018622649468116954230324555319775483054083583145719820778679015026209"); 

}
