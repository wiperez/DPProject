USE [domiprof]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Account](
	[AccountId] [int] IDENTITY(1,1) NOT NULL,
	[AccountCode] [varchar](10) NOT NULL,
	[ParentAccount] [int] NOT NULL,
	[AccountName] [varchar](150) NOT NULL,
	[AccountDescription] [varchar](250) NULL,
 CONSTRAINT [PK_Accounts] PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerId] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Name] [varchar](250) NOT NULL,
	[GroupId] [int] NOT NULL,
	[Disabled] [bit] NOT NULL CONSTRAINT [DF_Customer_Disabled]  DEFAULT ((0)),
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CustomerGroup]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CustomerGroup](
	[CustomerGroupId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[Description] [nvarchar](250) NULL,
 CONSTRAINT [PK_CustomerGroup_1] PRIMARY KEY CLUSTERED 
(
	[CustomerGroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalOperation]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalOperation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NOT NULL,
	[PeriodId] [int] NOT NULL,
	[OperationDate] [date] NOT NULL,
	[Amount] [money] NOT NULL CONSTRAINT [DF_JournalOperation_Amount]  DEFAULT ((0)),
	[Description] [nvarchar](500) NULL,
	[Deleted] [bit] NOT NULL CONSTRAINT [DF_JournalOperation_Deleted]  DEFAULT ((0)),
 CONSTRAINT [PK_Operations] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Period]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Period](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_Periods] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Purchase]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Purchase](
	[PurchaseId] [int] IDENTITY(1,1) NOT NULL,
	[JournalOperationId] [int] NOT NULL,
	[VendorId] [int] NOT NULL,
 CONSTRAINT [PK_Purchase] PRIMARY KEY CLUSTERED 
(
	[PurchaseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Sale]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sale](
	[SaleId] [int] IDENTITY(1,1) NOT NULL,
	[JournalOperationId] [int] NOT NULL,
	[CustomerId] [int] NOT NULL,
 CONSTRAINT [PK_Sale] PRIMARY KEY CLUSTERED 
(
	[SaleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Vendor]    Script Date: 4/5/2016 9:18:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vendor](
	[VendorId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[Description] [nchar](200) NULL,
	[Disabled] [bit] NOT NULL CONSTRAINT [DF_Vendor_Disabled]  DEFAULT ((0)),
 CONSTRAINT [PK_Vendor] PRIMARY KEY CLUSTERED 
(
	[VendorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[Account] ON 

INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (1, N'1', 0, N'Activo', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (2, N'101', 1, N'Ventas', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (3, N'102', 1, N'Inventario', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (4, N'2', 0, N'Gastos', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (5, N'201', 4, N'Salarios', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (6, N'202', 4, N'BANK CHARGES ', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (7, N'203', 4, N'USATAX', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (8, N'204', 4, N'SUN PASS', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (10, N'205', 4, N'TUNDRA', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (11, N'206', 4, N'TELEFONO', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (12, N'207', 4, N'LICENCIAS', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (13, N'208', 4, N'CELULAR', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (14, N'209', 4, N'PALLELLAT Y FORLLIS', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (15, N'210', 4, N'FPL', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (16, N'211', 4, N'PALACE', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (17, N'212', 4, N'WATER', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (18, N'213', 4, N'INTERNET', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (19, N'214', 4, N'SEGURO MEDICO', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (20, N'215', 4, N'SEGURO DOMINGO', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (21, N'216', 4, N'BASURA', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (22, N'217', 4, N'FAUSTO', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (23, N'218', 4, N'PACA
', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (24, N'219', 4, N'RENTA', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (25, N'220', 4, N'LEXUS', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (26, N'221', 4, N'CHAPAS', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (27, N'222', 4, N'SEGURO PROPIEDAD', NULL)
INSERT [dbo].[Account] ([AccountId], [AccountCode], [ParentAccount], [AccountName], [AccountDescription]) VALUES (28, N'3', 0, N'Compras', NULL)
SET IDENTITY_INSERT [dbo].[Account] OFF
SET IDENTITY_INSERT [dbo].[Customer] ON 

INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (1, N'CRT', N'La Carreta Restaurant', 3, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (2, N'MNL', N'Manolon', 2, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (3, N'FLN', N'Fulano de Tal', 1, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (4, N'AAA', N'Alberto', 1, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (6, N'ABC', N'Aedario', 2, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (7, N'WJPH', N'William Jorge Perez', 1, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (10, N'MIC', N'Microsoft', 3, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (11, N'AP', N'Apple', 1, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (12, N'CL', N'Colgate', 2, 0)
INSERT [dbo].[Customer] ([CustomerId], [Code], [Name], [GroupId], [Disabled]) VALUES (13, N'MC', N'MacDonalds', 3, 0)
SET IDENTITY_INSERT [dbo].[Customer] OFF
SET IDENTITY_INSERT [dbo].[CustomerGroup] ON 

INSERT [dbo].[CustomerGroup] ([CustomerGroupId], [Name], [Description]) VALUES (1, N'Cash', N'Clientes que pagan en cash')
INSERT [dbo].[CustomerGroup] ([CustomerGroupId], [Name], [Description]) VALUES (2, N'Piso', N'Clientes internos de la Plasa')
INSERT [dbo].[CustomerGroup] ([CustomerGroupId], [Name], [Description]) VALUES (3, N'Mercado', N'??')
SET IDENTITY_INSERT [dbo].[CustomerGroup] OFF
SET IDENTITY_INSERT [dbo].[JournalOperation] ON 

INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (1, 3, 4, CAST(N'2016-04-01' AS Date), 52000.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (2, 2, 5, CAST(N'2016-05-03' AS Date), 1160.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (3, 2, 5, CAST(N'2016-05-06' AS Date), 100.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (4, 2, 5, CAST(N'2016-05-03' AS Date), 990.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (5, 2, 5, CAST(N'2016-05-13' AS Date), 500.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (6, 2, 5, CAST(N'2016-05-18' AS Date), 12000.0000, N'Calendar validado 1', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (7, 2, 5, CAST(N'2016-05-09' AS Date), 50.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (8, 2, 5, CAST(N'2016-05-31' AS Date), 450.0000, N'Ajustado detalle con fechas en la vista...', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (9, 2, 5, CAST(N'2016-05-12' AS Date), 1000.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (10, 2, 5, CAST(N'2016-05-12' AS Date), 345.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (11, 2, 5, CAST(N'2016-05-25' AS Date), 116.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (12, 2, 5, CAST(N'2016-05-06' AS Date), 2323.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (13, 2, 5, CAST(N'2016-05-03' AS Date), 244.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (14, 2, 5, CAST(N'2016-05-02' AS Date), 456.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (15, 2, 5, CAST(N'2016-05-03' AS Date), 353.0000, N'Only the dates of the selected week period', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (16, 28, 5, CAST(N'2016-05-05' AS Date), 2343.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (17, 2, 5, CAST(N'2016-05-06' AS Date), 453.0000, N'A ver si dad el error de William...', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (18, 2, 5, CAST(N'2016-05-23' AS Date), 234.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (19, 2, 5, CAST(N'2016-05-04' AS Date), 1000.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (20, 2, 4, CAST(N'2016-04-01' AS Date), 234.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (42, 28, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (52, 2, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (53, 28, 4, CAST(N'2016-04-01' AS Date), 234.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (54, 28, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (55, 28, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (56, 28, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (57, 2, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (58, 2, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (59, 2, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (60, 2, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (61, 28, 4, CAST(N'2016-04-01' AS Date), 100.0000, N'', 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (63, 13, 4, CAST(N'2016-04-01' AS Date), 200.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (64, 17, 4, CAST(N'2016-04-01' AS Date), 50.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (65, 25, 4, CAST(N'2016-04-01' AS Date), 120.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (66, 21, 4, CAST(N'2016-04-01' AS Date), 5.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (67, 6, 4, CAST(N'2016-04-01' AS Date), 100.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (68, 10, 4, CAST(N'2016-04-01' AS Date), 5.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (69, 7, 4, CAST(N'2016-04-01' AS Date), 2.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (70, 8, 4, CAST(N'2016-04-01' AS Date), 10.5000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (71, 11, 4, CAST(N'2016-04-01' AS Date), 2.7500, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (72, 12, 4, CAST(N'2016-04-01' AS Date), 0.7800, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (73, 3, 5, CAST(N'2016-05-01' AS Date), 53120.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (75, 5, 5, CAST(N'2016-05-01' AS Date), 12000.0000, NULL, 0)
INSERT [dbo].[JournalOperation] ([Id], [AccountId], [PeriodId], [OperationDate], [Amount], [Description], [Deleted]) VALUES (76, 14, 4, CAST(N'2016-04-01' AS Date), 20.0000, NULL, 0)
SET IDENTITY_INSERT [dbo].[JournalOperation] OFF
SET IDENTITY_INSERT [dbo].[Period] ON 

INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (1, CAST(N'2016-01-01' AS Date), CAST(N'2016-01-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (2, CAST(N'2016-02-01' AS Date), CAST(N'2016-02-29' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (3, CAST(N'2016-03-01' AS Date), CAST(N'2016-03-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (4, CAST(N'2016-04-01' AS Date), CAST(N'2016-04-30' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (5, CAST(N'2016-05-01' AS Date), CAST(N'2016-05-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (6, CAST(N'2016-06-01' AS Date), CAST(N'2016-06-30' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (7, CAST(N'2016-07-01' AS Date), CAST(N'2016-07-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (9, CAST(N'2016-08-01' AS Date), CAST(N'2016-08-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (10, CAST(N'2016-09-01' AS Date), CAST(N'2016-09-30' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (11, CAST(N'2016-10-01' AS Date), CAST(N'2016-10-31' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (12, CAST(N'2016-11-01' AS Date), CAST(N'2016-11-30' AS Date), 1)
INSERT [dbo].[Period] ([Id], [StartDate], [EndDate], [Status]) VALUES (13, CAST(N'2016-12-01' AS Date), CAST(N'2016-12-31' AS Date), 1)
SET IDENTITY_INSERT [dbo].[Period] OFF
SET IDENTITY_INSERT [dbo].[Purchase] ON 

INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (1, 16, 1)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (2, 42, 3)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (3, 53, 5)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (4, 54, 5)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (5, 55, 2)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (6, 56, 3)
INSERT [dbo].[Purchase] ([PurchaseId], [JournalOperationId], [VendorId]) VALUES (7, 61, 1)
SET IDENTITY_INSERT [dbo].[Purchase] OFF
SET IDENTITY_INSERT [dbo].[Sale] ON 

INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (1, 2, 6)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (2, 3, 1)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (3, 4, 4)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (4, 5, 2)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (5, 6, 1)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (6, 7, 4)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (7, 8, 3)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (8, 9, 1)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (9, 10, 7)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (10, 11, 3)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (11, 12, 2)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (12, 13, 3)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (13, 14, 1)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (14, 15, 7)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (15, 17, 2)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (16, 18, 2)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (17, 19, 3)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (18, 20, 3)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (21, 52, 7)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (22, 57, 6)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (23, 58, 1)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (24, 59, 2)
INSERT [dbo].[Sale] ([SaleId], [JournalOperationId], [CustomerId]) VALUES (25, 60, 1)
SET IDENTITY_INSERT [dbo].[Sale] OFF
SET IDENTITY_INSERT [dbo].[Vendor] ON 

INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (1, N'Apple', N'A turn in the bussiness                                                                                                                                                                                 ', 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (2, N'Microsoft', N'The best deal of the history                                                                                                                                                                            ', 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (3, N'IBM', N'Good until the Chinese...                                                                                                                                                                               ', 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (4, N'Colgate', NULL, 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (5, N'Coca Cola', N'The most wanted                                                                                                                                                                                         ', 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (6, N'McDonalds', NULL, 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (7, N'Ikea', N'Good in Canada                                                                                                                                                                                          ', 0)
INSERT [dbo].[Vendor] ([VendorId], [Name], [Description], [Disabled]) VALUES (8, N'AT & T', NULL, 0)
SET IDENTITY_INSERT [dbo].[Vendor] OFF
ALTER TABLE [dbo].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Customer_CustomerGroup] FOREIGN KEY([GroupId])
REFERENCES [dbo].[CustomerGroup] ([CustomerGroupId])
GO
ALTER TABLE [dbo].[Customer] CHECK CONSTRAINT [FK_Customer_CustomerGroup]
GO
ALTER TABLE [dbo].[JournalOperation]  WITH CHECK ADD  CONSTRAINT [FK_JournalOperation_Account] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Account] ([AccountId])
GO
ALTER TABLE [dbo].[JournalOperation] CHECK CONSTRAINT [FK_JournalOperation_Account]
GO
ALTER TABLE [dbo].[JournalOperation]  WITH CHECK ADD  CONSTRAINT [FK_JournalOperation_Period] FOREIGN KEY([PeriodId])
REFERENCES [dbo].[Period] ([Id])
GO
ALTER TABLE [dbo].[JournalOperation] CHECK CONSTRAINT [FK_JournalOperation_Period]
GO
ALTER TABLE [dbo].[Purchase]  WITH CHECK ADD  CONSTRAINT [FK_Purchase_JournalOperation] FOREIGN KEY([JournalOperationId])
REFERENCES [dbo].[JournalOperation] ([Id])
GO
ALTER TABLE [dbo].[Purchase] CHECK CONSTRAINT [FK_Purchase_JournalOperation]
GO
ALTER TABLE [dbo].[Purchase]  WITH CHECK ADD  CONSTRAINT [FK_Purchase_Vendor] FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendor] ([VendorId])
GO
ALTER TABLE [dbo].[Purchase] CHECK CONSTRAINT [FK_Purchase_Vendor]
GO
ALTER TABLE [dbo].[Sale]  WITH CHECK ADD  CONSTRAINT [FK_Sale_Customer] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customer] ([CustomerId])
GO
ALTER TABLE [dbo].[Sale] CHECK CONSTRAINT [FK_Sale_Customer]
GO
ALTER TABLE [dbo].[Sale]  WITH CHECK ADD  CONSTRAINT [FK_Sale_JournalOperation] FOREIGN KEY([JournalOperationId])
REFERENCES [dbo].[JournalOperation] ([Id])
GO
ALTER TABLE [dbo].[Sale] CHECK CONSTRAINT [FK_Sale_JournalOperation]
GO
