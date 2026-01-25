CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT 'users id',
    `username` varchar(255) NOT NULL COMMENT 'users name',
    `password` varchar(255) NOT NULL COMMENT 'users password by hash',
    `level` int NOT NULL COMMENT 'users level', 
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
