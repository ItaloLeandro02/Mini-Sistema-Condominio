USE [master]
GO
/****** Object:  Database [BD_SistemaCondominio]    Script Date: 14/11/2018 16:43:13 ******/
CREATE DATABASE [BD_SistemaCondominio]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BD_SistemaCondominio', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\BD_SistemaCondominio.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'BD_SistemaCondominio_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\BD_SistemaCondominio_log.ldf' , SIZE = 2048KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [BD_SistemaCondominio] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BD_SistemaCondominio].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BD_SistemaCondominio] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET ARITHABORT OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [BD_SistemaCondominio] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BD_SistemaCondominio] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BD_SistemaCondominio] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BD_SistemaCondominio] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BD_SistemaCondominio] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BD_SistemaCondominio] SET  MULTI_USER 
GO
ALTER DATABASE [BD_SistemaCondominio] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BD_SistemaCondominio] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BD_SistemaCondominio] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BD_SistemaCondominio] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [BD_SistemaCondominio]
GO
/****** Object:  Table [dbo].[condomino]    Script Date: 14/11/2018 16:43:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[condomino](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[usuario_id] [int] NOT NULL,
	[pessoa_id] [int] NOT NULL,
	[endereco] [varchar](80) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[pessoa]    Script Date: 14/11/2018 16:43:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[pessoa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](60) NOT NULL,
	[cpf] [bigint] NOT NULL,
	[nascimento] [date] NOT NULL,
	[digital] [varchar](5) NOT NULL,
	[endereco_logradouro] [varchar](120) NOT NULL,
	[endereco_numero] [varchar](120) NOT NULL,
	[endereco_bairro] [varchar](60) NOT NULL,
	[endereco_cidade] [varchar](100) NOT NULL,
	[endereco_uf] [varchar](2) NOT NULL,
	[criacao] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[porteiro]    Script Date: 14/11/2018 16:43:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[porteiro](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pessoa_id] [int] NOT NULL,
	[usuario_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[usuario]    Script Date: 14/11/2018 16:43:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](80) NOT NULL,
	[tipo] [int] NOT NULL,
	[senha] [varchar](32) NOT NULL,
	[desativado] [tinyint] NOT NULL,
	[criacao] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[visita]    Script Date: 14/11/2018 16:43:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[visita](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[condomino_id] [int] NULL,
	[pessoa_id] [int] NULL,
	[data_hora_reserva] [datetime] NULL,
	[nome_convidado] [varchar](80) NULL,
	[condomino_observacao] [varchar](120) NULL,
	[data_hora_expiracao] [timestamp] NOT NULL,
	[situacao] [int] NULL,
	[portaria_data_hora_chegada] [datetime] NULL,
	[porteiro_id] [int] NULL,
	[portaria_observacao] [varchar](120) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[condomino]  WITH CHECK ADD  CONSTRAINT [FK_condomino_pessoa] FOREIGN KEY([pessoa_id])
REFERENCES [dbo].[pessoa] ([id])
GO
ALTER TABLE [dbo].[condomino] CHECK CONSTRAINT [FK_condomino_pessoa]
GO
ALTER TABLE [dbo].[condomino]  WITH CHECK ADD  CONSTRAINT [FK_condomino_usuario] FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[condomino] CHECK CONSTRAINT [FK_condomino_usuario]
GO
ALTER TABLE [dbo].[porteiro]  WITH CHECK ADD  CONSTRAINT [FK_porteiro_pessoa] FOREIGN KEY([pessoa_id])
REFERENCES [dbo].[pessoa] ([id])
GO
ALTER TABLE [dbo].[porteiro] CHECK CONSTRAINT [FK_porteiro_pessoa]
GO
ALTER TABLE [dbo].[porteiro]  WITH CHECK ADD  CONSTRAINT [FK_porteiro_usuario] FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[porteiro] CHECK CONSTRAINT [FK_porteiro_usuario]
GO
ALTER TABLE [dbo].[visita]  WITH CHECK ADD  CONSTRAINT [FK_visita_condomino] FOREIGN KEY([condomino_id])
REFERENCES [dbo].[condomino] ([id])
GO
ALTER TABLE [dbo].[visita] CHECK CONSTRAINT [FK_visita_condomino]
GO
ALTER TABLE [dbo].[visita]  WITH CHECK ADD  CONSTRAINT [FK_visita_pessoa] FOREIGN KEY([pessoa_id])
REFERENCES [dbo].[pessoa] ([id])
GO
ALTER TABLE [dbo].[visita] CHECK CONSTRAINT [FK_visita_pessoa]
GO
ALTER TABLE [dbo].[visita]  WITH CHECK ADD  CONSTRAINT [FK_visita_porteiro] FOREIGN KEY([porteiro_id])
REFERENCES [dbo].[porteiro] ([id])
GO
ALTER TABLE [dbo].[visita] CHECK CONSTRAINT [FK_visita_porteiro]
GO
USE [master]
GO
ALTER DATABASE [BD_SistemaCondominio] SET  READ_WRITE 
GO
