-- phpMyAdmin SQL Dump
-- version 4.6.5.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 23, 2017 at 11:14 PM
-- Server version: 5.7.17-0ubuntu1
-- PHP Version: 7.0.15-1ubuntu2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social3`
--
CREATE DATABASE IF NOT EXISTS `social3` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `social3`;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `publisher` varchar(128) NOT NULL,
  `postdate` date NOT NULL,
  `content` text NOT NULL,
  `likes` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `publisher`, `postdate`, `content`, `likes`) VALUES
(1, 'pvaqueiroz', '2017-02-22', 'Testing the third test', 0),
(2, 'pvaqueiroz', '2017-02-22', 'Test 2323123123', 0),
(3, 'hacker', '2017-02-22', 'Im hacking this thing!!!', 0),
(4, 'pvaqueiroz', '2017-02-22', 'testing the prepend thing', 0),
(5, 'pvaqueiroz', '2017-02-22', 're-testing the prepend thing', 0),
(7, 'Mr Dibre', '2017-02-23', 'bvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvn', 0),
(9, 'Mr Dibre', '2017-02-23', 'gjhghgkjh', 0),
(11, 'Mr Dibre', '2017-02-23', 'gjhghgkjh', 0),
(12, 'pvaqueiroz', '2017-02-23', 'PET Ã‰ LINDA (ELA QUE ME FEZ ESCREVER ISSO)', 0),
(13, 'pvaqueiroz', '2017-02-23', 'LAYOUT DE 2003 QUE LIXO!!', 0),
(14, 'pvaqueiroz', '2017-02-23', 'QUIZZ DE LOL... QUEM NAO TEM BRAÃ‡O E FAZ PENTAKILL MESMO ASSIM?', 0),
(15, 'pvaqueiroz', '2017-02-23', 'MASTER COTOCO YI', 0),
(16, 'pvaqueiroz', '2017-02-23', 'MINHA REDE SOCIAL Ã‰ MELHOR QUE A DO BRAU!!!!', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(128) NOT NULL,
  `password` varchar(2048) NOT NULL,
  `email` varchar(512) NOT NULL,
  `fullname` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`) VALUES
(1, 'pvaqueiroz', 'bfdb82d788b842a5e43493adf90a65a3', 'pvaqueiroz@gmail.com', 'Paulo Queiroz'),
(2, 'hacker', 'e10adc3949ba59abbe56e057f20f883e', 'hacker@hacking.hck', 'Mr Hacker'),
(3, 'Mr Dibre', '5db4dafdfa1711700c179c6c007b170b', 'cesar.felp982@gmail.com', 'Dibrante DibranteTT Jarvameniuldo');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
