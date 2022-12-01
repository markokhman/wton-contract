func -SPA -o ./build/jetton-wallet.fif common/stdlib.fc params.fc op-codes.fc jetton-utils.fc jetton-wallet.fc
echo '"build/jetton-wallet.fif" include 2 boc+>B "build/jetton-wallet.boc" B>file' | fift -s
func -SPA -o ./build/jetton-minter.fif common/stdlib.fc params.fc op-codes.fc jetton-utils.fc jetton-minter.fc
func -SPA -o ./build/jetton-minter-ICO.fif common/stdlib.fc params.fc op-codes.fc jetton-utils.fc jetton-minter-ICO.fc
func -SPA -o ./build/jetton-discovery.fif common/stdlib.fc params.fc op-codes.fc discovery-params.fc jetton-utils.fc jetton-discovery.fc
func -SPA -o ./build/jetton-minter-discoverable.fif common/stdlib.fc params.fc op-codes.fc discovery-params.fc jetton-utils.fc jetton-minter-discoverable.fc

fift -s build/print-hex.fif
