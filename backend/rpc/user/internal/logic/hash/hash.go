package hash

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"

	"golang.org/x/crypto/argon2"
)

// Params 定义 Argon2id 算法的参数
type Params struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	SaltLength  uint32
	KeyLength   uint32
}

// DefaultParams 默认参数设置
var DefaultParams = &Params{
	Memory:      64 * 1024, // 64 MB
	Iterations:  3,
	Parallelism: 2,
	SaltLength:  16,
	KeyLength:   32,
}

// HashPassword 使用 Argon2id 算法对密码进行哈希
func HashPassword(password string, params *Params) (encodedHash string, err error) {
	// 生成随机盐值
	salt := make([]byte, params.SaltLength)
	if _, err = rand.Read(salt); err != nil {
		return "", err
	}

	// 使用 Argon2id 计算哈希值
	hash := argon2.IDKey([]byte(password), salt, params.Iterations, params.Memory, params.Parallelism, params.KeyLength)

	// 将参数、盐值和哈希值编码为 Base64 格式存储
	b64Salt := base64.StdEncoding.EncodeToString(salt)
	b64Hash := base64.StdEncoding.EncodeToString(hash)

	// 组合参数和结果，格式为：$argon2id$v=19$m=内存,k=并行数,t=迭代次数,p=并行度$salt$hash
	encodedHash = fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		params.Memory, params.Iterations, params.Parallelism, b64Salt, b64Hash)

	return encodedHash, nil
}

// ComparePasswordAndHash 验证密码与哈希值是否匹配
func ComparePasswordAndHash(password, encodedHash string) (match bool, err error) {
	vals, err := decodeHash(encodedHash)
	if err != nil {
		return false, err
	}

	// 使用相同的参数重新计算哈希值
	newHash := argon2.IDKey([]byte(password), vals.salt, vals.params.Iterations, vals.params.Memory, vals.params.Parallelism, vals.params.KeyLength)

	// 使用常量时间比较防止时序攻击
	match = subtle.ConstantTimeCompare(newHash, vals.hash) == 1

	return match, nil
}

// decodedHash 存储解码后的哈希信息
type decodedHash struct {
	params *Params
	salt   []byte
	hash   []byte
}

// decodeHash 解析编码的哈希字符串
func decodeHash(encodedHash string) (vals *decodedHash, err error) {
	// 检查哈希格式
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 || parts[1] != "argon2id" || parts[2] != "v=19" {
		return nil, fmt.Errorf("invalid hash format")
	}

	// 解析参数
	paramStr := parts[3]
	params := strings.Split(paramStr, ",")

	p := &Params{}
	for _, param := range params {
		kv := strings.Split(param, "=")
		if len(kv) != 2 {
			continue
		}

		key := kv[0]
		value, err := strconv.ParseUint(kv[1], 10, 32)
		if err != nil {
			return nil, fmt.Errorf("error parsing parameter %s: %v", key, err)
		}

		switch key {
		case "m":
			p.Memory = uint32(value)
		case "t":
			p.Iterations = uint32(value)
		case "p":
			p.Parallelism = uint8(value)
		}
	}

	// 解码盐值和哈希值
	salt, err := base64.StdEncoding.DecodeString(parts[4])
	if err != nil {
		return nil, fmt.Errorf("error decoding salt: %v", err)
	}

	hash, err := base64.StdEncoding.DecodeString(parts[5])
	if err != nil {
		return nil, fmt.Errorf("error decoding hash: %v", err)
	}

	return &decodedHash{
		params: p,
		salt:   salt,
		hash:   hash,
	}, nil
}
