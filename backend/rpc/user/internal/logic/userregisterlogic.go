package logic

import (
	"context"

	"ReelFlow/rpc/user/internal/svc"
	"ReelFlow/rpc/user/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserRegisterLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUserRegisterLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserRegisterLogic {
	return &UserRegisterLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

// 注册
func (l *UserRegisterLogic) UserRegister(in *user.UserRegisterReq) (*user.UserRegisterResp, error) {
	// todo: add your logic here and delete this line

	return &user.UserRegisterResp{}, nil
}
