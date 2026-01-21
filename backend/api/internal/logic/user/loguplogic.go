package user

import (
	"context"

	"ReelFlow/api/internal/svc"
	"ReelFlow/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type LogupLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLogupLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LogupLogic {
	return &LogupLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LogupLogic) Logup(req *types.UserRegisterReq) (resp *types.UserRegisterResp, err error) {
	// todo: add your logic here and delete this line

	return
}
