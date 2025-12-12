                {{-- LinkedIn --}}
                @if (!empty($card1['linkedin']))
                    @php
                        $linkedin = $card1['linkedin'];
                        $linkedinUrl = \Illuminate\Support\Str::startsWith($linkedin, ['http://', 'https://'])
                            ? $linkedin
                            : 'https://' . $linkedin;
                    @endphp

                    <div class="d-flex align-items-center gap-2">
                        <i class="fab fa-linkedin fa-lg"></i>
                        <a target="_blank" href="{{ $linkedinUrl }}">{{ $linkedin }}</a>
                    </div>
                @endif

                {{-- Facebook --}}
                @if (!empty($card1['facebook']))
                    @php
                        $facebook = $card1['facebook'];
                        $facebookUrl = \Illuminate\Support\Str::startsWith($facebook, ['http://', 'https://'])
                            ? $facebook
                            : 'https://' . $facebook;
                    @endphp

                    <div class="d-flex align-items-center gap-2">
                        <i class="fab fa-facebook fa-lg"></i>
                        <a target="_blank" href="{{ $facebookUrl }}">{{ $facebook }}</a>
                    </div>
                @endif

                {{-- E-mail --}}
                @if (!empty($card1['email']))
                    <div class="d-flex align-items-center gap-2">
                        <i class="fas fa-envelope fa-lg"></i>
                        <a href="mailto:{{ $card1['email'] }}">{{ $card1['email'] }}</a>
                    </div>
                @endif

                {{-- Telefone --}}
                @if (!empty($card1['phone']))
                    @php
                        $phone = $card1['phone'];
                        // remove tudo que não é número para o link tel:
                        $phoneTel = preg_replace('/\D+/', '', $phone);
                    @endphp

                    <div class="d-flex align-items-center gap-2">
                        <i class="fas fa-phone fa-lg"></i>
                        <a href="tel:{{ $phoneTel }}">{{ $phone }}</a>
                    </div>
                @endif