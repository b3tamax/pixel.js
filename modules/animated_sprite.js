// Copyright (C) 2013 rastating
//
// Version 0.0.3
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.

PixelJS.AnimatedSprite = function () {
    this.spriteSheet = {};
};

PixelJS.extend(PixelJS.AnimatedSprite, PixelJS.Sprite);

PixelJS.AnimatedSprite.prototype._currentFrame = 0;
PixelJS.AnimatedSprite.prototype._frameTickCount = 0;
PixelJS.AnimatedSprite.prototype._isAnimating = true;
PixelJS.AnimatedSprite.prototype.defaultFrame = 0;
PixelJS.AnimatedSprite.prototype.row = 0;
PixelJS.AnimatedSprite.prototype.speed = 0.2;

Object.defineProperty(PixelJS.AnimatedSprite.prototype, "isAnimating", {
    get: function () { return this._isAnimating; },
    configurable: false,
    enumerable: false
});

PixelJS.AnimatedSprite.prototype.startAnimating = function () {
    this._isAnimating = true;
}

PixelJS.AnimatedSprite.prototype.stopAnimating = function () {
    this._isAnimating = false;
}

PixelJS.AnimatedSprite.prototype.load = function (info, callback) {
    "use strict";
    var self = this;
    
    if (info !== undefined) {
        if (info.name !== undefined) {
            this.name = info.name;
        }
        
        if (info.transparencyKey !== undefined) {
            this.transparencyKey = info.transparencyKey;
        }
        
        if (info.defaultFrame !== undefined) {
            this.defaultFrame = info.defaultFrame;
        }
        
        if (info.speed !== undefined) {
            this.speed = info.speed;
        }
        
        if (info.callback !== undefined) {
            this.onLoad = info.callback;
        }
    }
    
    if (callback !== undefined) {
        this.onLoad = callback;
    }
    
    this.spriteSheet = new PixelJS.SpriteSheet();
    this.spriteSheet.load(info, function () {
        self.loaded = true;
    });
};
                          
PixelJS.AnimatedSprite.prototype.draw = function (entity) {
    "use strict";
    
    if (this.loaded) {
        if (this.speed > 0 && this._isAnimating) {
            if (!isNaN(entity.layer.engine._deltaTime)) {
                this._frameTickCount += entity.layer.engine._deltaTime * 1000;
                if (this._frameTickCount >= this.speed) {
                    this._frameTickCount = 0;
                    this._currentFrame = this._currentFrame == this.spriteSheet.frameCount - 1 ? 0 : this._currentFrame + 1;
                }
            }
        }
        else {
            this._currentFrame = this.defaultFrame;   
        }
        
        entity.layer.drawImage(this.spriteSheet._frameImages[this.row][this._currentFrame], entity.pos.x, entity.pos.y);
    }
};