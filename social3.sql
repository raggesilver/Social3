-- phpMyAdmin SQL Dump
-- version 4.6.5.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 01, 2017 at 11:34 AM
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
(20, 'pvaqueiroz', '2017-02-28', '{\"contentType\":\"media\",\"content\":\"asdasd\",\"attatchments\":[\"4bb53e0a6e602661f5e99a8762dc20af.jpeg\"]}', 0),
(21, 'pvaqueiroz', '2017-02-28', '{\"contentType\":\"text\",\"content\":\"Try harda\",\"attatchments\":[]}', 0),
(22, 'pvaqueiroz', '2017-02-28', '{\"contentType\":\"gallery\",\"content\":\"Testing 2 images\",\"attatchments\":[\"98096473658737f60b038859b01dd8bc.jpeg\",\"b5d50f576457500799c29cddda0d31e2.jpeg\"]}', 1),
(23, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"media\",\"content\":\"Anelisa u00e9 uma ameba\",\"attatchments\":[\"d0a26b3599204b17e2ddda5637be5acb.jpeg\"]}', 1),
(24, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"text\",\"content\":\"Testing the spinning button\",\"attatchments\":[]}', 1),
(25, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"text\",\"content\":\"Timed out\",\"attatchments\":[]}', 1),
(26, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"text\",\"content\":\"Last try\",\"attatchments\":[]}', 1),
(27, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"media\",\"content\":\"Trying again just to make sure\",\"attatchments\":[\"82876e723d5cc0fb6cd317f45b8b9e58.png\"]}', 1),
(28, 'pvaqueiroz', '2017-03-01', '{\"contentType\":\"media\",\"content\":\"Testing the functions.php\",\"attatchments\":[\"d5c2b62476c6debe10c557ae81061855.jpeg\"]}', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(128) NOT NULL,
  `password` varchar(2048) NOT NULL,
  `email` varchar(512) NOT NULL,
  `fullname` varchar(512) NOT NULL,
  `likes` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `likes`) VALUES
(1, 'pvaqueiroz', 'bfdb82d788b842a5e43493adf90a65a3', 'pvaqueiroz@gmail.com', 'Paulo Queiroz', '[27, 26, 22, 25, 24, 23, 28]'),
(2, 'hacker', 'e10adc3949ba59abbe56e057f20f883e', 'hacker@hacking.hck', 'Mr Hacker', '[]'),
(3, 'Mr Dibre', '5db4dafdfa1711700c179c6c007b170b', 'cesar.felp982@gmail.com', 'Dibrante DibranteTT Jarvameniuldo', '[]');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
