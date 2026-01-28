package svc

import (
	"ReelFlow/rpc/model/user"
	"ReelFlow/rpc/user/internal/config"

	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

type ServiceContext struct {
	Config config.Config
	Model  user.UserModel
}

func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		Config: c,
		Model:  user.NewUserModel(sqlx.NewMysql(c.DataSource), c.Cache),
	}
}
