package logic

import (
	"context"

	"ReelFlow/rpc/user/internal/logic/hash"
	"ReelFlow/rpc/user/internal/svc"
	"ReelFlow/rpc/user/user"

	userModel "ReelFlow/rpc/model/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserRegisterLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

const normalUserLevel = 1

func NewUserRegisterLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserRegisterLogic {
	return &UserRegisterLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

// 注册
func (l *UserRegisterLogic) UserRegister(in *user.UserRegisterReq) (*user.UserRegisterResp, error) {
	i := in
	p, err := hash.HashPassword(i.Password, hash.DefaultParams)
	if err != nil {
		return nil, err
	}

	_, err = l.svcCtx.Model.Insert(l.ctx, &userModel.User{
		Username: i.Username,
		Password: p,
		Level:    normalUserLevel,
	})
	if err != nil {
		return nil, err
	}

	return &user.UserRegisterResp{
		IsSuccess: true,
	}, nil
}
