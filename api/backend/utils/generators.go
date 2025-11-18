package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

const (
	charset     = "0123456789ABCDEF"
	idLength    = 8  
	hashLength  = 12 
)


func GenerateID() string {
	id := generateRandomString(idLength)
	// A3F1-91BC (4-4)
	return fmt.Sprintf("%s-%s", id[:4], id[4:8])
}

func GenerateHash() string {
	return generateRandomString(hashLength)
}


func generateRandomString(length int) string {
	result := make([]byte, length)
	max := big.NewInt(int64(len(charset)))

	for i := range result {
		idx, err := rand.Int(rand.Reader, max)
		if err != nil {
			idx = big.NewInt(int64(i % len(charset)))
		}
		result[i] = charset[idx.Int64()]
	}

	return string(result)
}

