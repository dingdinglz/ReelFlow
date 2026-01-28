package user

import (
	"context"
	"time"

	"ReelFlow/api/internal/svc"
	"ReelFlow/api/internal/types"
	"ReelFlow/rpc/user/user"

	"github.com/golang-jwt/jwt/v4"
	"github.com/zeromicro/go-zero/core/logx"
)

type RefreshTokenLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRefreshTokenLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RefreshTokenLogic {
	return &RefreshTokenLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *RefreshTokenLogic) RefreshToken(req *types.RefreshTokenReq) (resp *types.UserLoginResp, err error) {
	r, err := l.svcCtx.UserClient.RefreshToken(l.ctx, &user.RefreshTokenReq{
		Id: l.ctx.Value("id").(int64),
	})
	if err != nil {
		return nil, err
	}

	if !r.IsSuccess {
		resp = &types.UserLoginResp{
			Message: types.Message{
				Code:    400,
				Message: "refresh token failed",
			},
		}
		return
	}
	accessToken, err := l.generateToken(r.Id, l.svcCtx.Config.Auth.AccessExpire)
	refreshToken, err := l.generateToken(r.Id, l.svcCtx.Config.Auth.RefreshExpire)

	resp = &types.UserLoginResp{
		Message: types.Message{
			Code:    200,
			Message: "refresh token successfully",
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	return
}

func (l *RefreshTokenLogic) generateToken(id int64, expire int64) (token string, err error) {
	privKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(l.svcCtx.Config.Auth.RSAPrivateKey))
	if err != nil {
		return "", err
	}

	now := time.Now().Unix()
	claims := jwt.MapClaims{
		"id":  id,
		"iat": now,
		"exp": now + expire,
		"iss": "ReelFlow",
		"sub": "user-auth",
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token, err = jwtToken.SignedString(privKey)
	return token, nil
}
