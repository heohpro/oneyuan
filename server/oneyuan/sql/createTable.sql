//id定为ObjectId的长度,又new ObjectId 生成
CREATE TABLE user (
  id varchar(24) NOT NULL,
  realName varchar(20) DEFAULT NULL COMMENT '真实姓名',
  nickName varchar(20) DEFAULT NULL COMMENT '昵称',
  loginName varchar(20) NOT NULL COMMENT '登录用户名',
  password varchar(32) NOT NULL COMMENT '密码',
  mobilePhone varchar(11) DEFAULT NULL COMMENT '手机号',
  email varchar(20) DEFAULT NULL COMMENT '邮件',
  avatar varchar(40) DEFAULT NULL COMMENT '用户头像',
  sex varchar(2) DEFAULT NULL COMMENT '性别',
  balance int DEFAULT 0 COMMENT '余额',
  bonus int DEFAULT 0 COMMENT '积分',
  address text DEFAULT NULL COMMENT '地址',
  createTime long NOT NULL COMMENT '注册时间',
  updateTime long NOT NULL COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户信息表';

insert into user(id,loginName,password,createTime,updateTime) value('','','','','');

CREATE TABLE bill (
  id varchar(24) NOT NULL,
  userId varchar(24) NOT NULL COMMENT '用户ID',
  type varchar(10) NOT NULL COMMENT '类型，收入，支出',
  amount int DEFAULT 0 COMMENT '交易金额',
  createTime long NOT NULL COMMENT '交易时间',
  description varchar(40) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户账单表';

CREATE TABLE type (
  id varchar(24) NOT NULL,
  code varchar(4) NOT NULL COMMENT '分类编码（1001电脑，手机，前两位数表示大类，后两位表示细分,如果只是两位数，表示大类类型）',
  typeName varchar(20) NOT NULL COMMENT '类型的名字如（电脑配件，日常用品）',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '类型表';

CREATE TABLE commodity (
  id varchar(24) NOT NULL,
  name varchar(100) DEFAULT NULL COMMENT '商品名称',
  typeCode varchar(4) DEFAULT NULL COMMENT '商品类型',
  label varchar(20) DEFAULT NULL COMMENT '标签',
  crowdfundNumber int DEFAULT 0 COMMENT '已经众筹次数',
  price int DEFAULT 0 COMMENT '价钱',
  imageList varchar(100) DEFAULT NULL COMMENT '图片地址',
  detail varchar(40) DEFAULT NULL COMMENT '详情  暂时为第三方网页介绍',
  introduction text DEFAULT NULL COMMENT '商品介绍',
  createTime long NOT NULL COMMENT '创建时间',
  updateTime long NOT NULL COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '商品信息表格';

CREATE TABLE crowdfund_instance (
  id varchar(24) NOT NULL,
  commodityId varchar(24) NOT NULL COMMENT '商品ID',
  periodId int DEFAULT 0 COMMENT '第几期，期数',
  totalNumber int DEFAULT 0 COMMENT '商品众筹总份数',
  currentNumber int DEFAULT 0 COMMENT '已筹得份数',
  startTime long NOT NULL COMMENT '开始时间',
  endTime long NOT NULL COMMENT '结束时间',
  isFinish tinyInt DEFAULT 0 COMMENT '是否结束',
  luckyNumber varchar(10) DEFAULT NULL COMMENT '幸运号码', 
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '众筹实例表';


CREATE TABLE order_of_crowdfund (
  id varchar(24) NOT NULL,
  userId varchar(24) NOT NULL COMMENT '用户Id',
  crowdfundInstanceId varchar(24) NOT NULL COMMENT '众筹实例Id',
  lotteryNumber varchar(10) DEFAULT NULL COMMENT '抽奖号码',
  createTime long NOT NULL COMMENT '建立时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '众筹交易记录表';

CREATE TABLE lucky_user (
  id varchar(24) NOT NULL,
  userId varchar(24) NOT NULL COMMENT '用户Id',
  crowdfundInstanceId varchar(24) NOT NULL COMMENT '众筹实例Id',
  createTime long DEFAULT NULL COMMENT '建立时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '众筹幸运者';


