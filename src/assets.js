var assets = new function() {
    this.images = {
        'AA_y': 'assets/img/AA_y.png',
        'AA_r': 'assets/img/AA_r.png',
        'AA_p': 'assets/img/AA_p.png',
        'AA_b': 'assets/img/AA_b.png',
        'AA_g': 'assets/img/AA_g.png',

        'AF_y': 'assets/img/AF_y.png',
        'AF_r': 'assets/img/AF_r.png',
        'AF_p': 'assets/img/AF_p.png',
        'AF_b': 'assets/img/AF_b.png',
        'AF_g': 'assets/img/AF_g.png',

        'AV_y': 'assets/img/AV_y.png',
        'AV_r': 'assets/img/AV_r.png',
        'AV_p': 'assets/img/AV_p.png',
        'AV_b': 'assets/img/AV_b.png',
        'AV_g': 'assets/img/AV_g.png',

        'FA_y': 'assets/img/FA_y.png',
        'FA_r': 'assets/img/FA_r.png',
        'FA_p': 'assets/img/FA_p.png',
        'FA_b': 'assets/img/FA_b.png',
        'FA_g': 'assets/img/FA_g.png',

        'FF_y': 'assets/img/FF_y.png',
        'FF_r': 'assets/img/FF_r.png',
        'FF_p': 'assets/img/FF_p.png',
        'FF_b': 'assets/img/FF_b.png',
        'FF_g': 'assets/img/FF_g.png',

        'FV_y': 'assets/img/FV_y.png',
        'FV_r': 'assets/img/FV_r.png',
        'FV_p': 'assets/img/FV_p.png',
        'FV_b': 'assets/img/FV_b.png',
        'FV_g': 'assets/img/FV_g.png',

        'VA_y': 'assets/img/VA_y.png',
        'VA_r': 'assets/img/VA_r.png',
        'VA_p': 'assets/img/VA_p.png',
        'VA_b': 'assets/img/VA_b.png',
        'VA_g': 'assets/img/VA_g.png',

        'VF_y': 'assets/img/VF_y.png',
        'VF_r': 'assets/img/VF_r.png',
        'VF_p': 'assets/img/VF_p.png',
        'VF_b': 'assets/img/VF_b.png',
        'VF_g': 'assets/img/VF_g.png',

        'VV_y': 'assets/img/VV_y.png',
        'VV_r': 'assets/img/VV_r.png',
        'VV_p': 'assets/img/VV_p.png',
        'VV_b': 'assets/img/VV_b.png',
        'VV_g': 'assets/img/VV_g.png',

        'frame_p1': 'assets/img/frame_p1.png',
        'frame_p2': 'assets/img/frame_p2.png',
        'frame_p3': 'assets/img/frame_p3.png',
        'frame_p4': 'assets/img/frame_p4.png',

        'land_0': 'assets/img/land_0.png',
        'land_1': 'assets/img/land_1.png',
        'land_2': 'assets/img/land_2.png',

        'round_modal': 'assets/img/round_modal.png',
        'logo': 'assets/img/logo.png',
        'background': 'assets/img/background2.png',

        'icon_left': 'assets/img/icon_left.png',
        'icon_right': 'assets/img/icon_right.png',
        'icon_up': 'assets/img/icon_up.png',
        'icon_down': 'assets/img/icon_down.png',
        'icon_plus': 'assets/img/icon_plus.png',
        'icon_minus': 'assets/img/icon_minus.png',

        'exp_sheet': 'assets/img/exp.png',
    };

    this.anims = {
        'explosion': {'src': 'assets/img/exp.png',
                      'params': { frameWidth: 32, frameHeight: 32 }},
        'dust': {'src': 'assets/img/dust.png',
                 'params': { frameWidth: 48, frameHeight: 48 }},
    }

    this.sounds = {
        'ok': ['assets/sound/ok1.wav',
               'assets/sound/ok2.wav',
               'assets/sound/ok3.wav',
               'assets/sound/ok4.wav'],
        'error': ['assets/sound/error.wav'],
        'explosion': ['assets/sound/explosion.wav'],
    }

    this.texts = {
        'p1': {'popup': { fontSize: '32px', fontFamily: 'invasion', fontStyle: 'bold',
                          fill: '#f70', stroke: '#000', strokeThickness: 1 },
               'board': { fontSize: '20px', fill: '#fff', fontFamily: 'invasion' }},
        'p2': {'popup': { fontSize: '32px', fontFamily: 'invasion', fontStyle: 'bold',
                          fill: '#f00', stroke: '#000', strokeThickness: 1, align: 'center' },
               'board': { fontSize: '20px', fill: '#fff', fontFamily: 'invasion' }},
        'p3': {'popup': { fontSize: '32px', fontFamily: 'invasion', fontStyle: 'bold',
                          fill: '#0f0', stroke: '#000', strokeThickness: 1, align: 'center' },
               'board': { fontSize: '20px', fill: '#fff', fontFamily: 'invasion' }},
        'p4': {'popup': { fontSize: '32px', fontFamily: 'invasion', fontStyle: 'bold',
                          fill: '#00f', stroke: '#000', strokeThickness: 1, align: 'center' },
               'board': { fontSize: '20px', fill: '#fff', fontFamily: 'invasion' }},
        'menu': { fontSize: '32px', fontFamily: 'invasion', fontStyle: 'bold',
                  fill: '#fff', stroke: '#000', strokeThickness: 3, align: 'center' },
        'timer': { fontSize: '40px', fill: '#fff', fontFamily: 'sans-serif', fontStyle: 'bold',
                   stroke: '#000', strokeThickness: 4, align: 'center' },
        'controls': { fontSize: '20px', fill: '#fff', fontFamily: 'sans-serif',fontStyle: 'bold' },
    }

    this.controls = {
        'p1': {'add': 'right', 'drop': 'left'},
        'p2': {'add': 'W', 'drop': 'Q'},
        'p3': {'add': 'B', 'drop': 'V'},
        'p4': {'add': 'O', 'drop': 'I'},
    }
}
