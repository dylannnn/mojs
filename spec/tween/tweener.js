(function() {
  var Timeline, Tween, t;

  t = window.mojs.tweener;

  Tween = window.mojs.Tween;

  Timeline = window.mojs.Timeline;

  describe('Tweener ->', function() {
    afterEach(function() {
      t._stopLoop();
      return t.removeAll();
    });
    beforeEach(function() {
      t._stopLoop();
      return t.removeAll();
    });
    it('have tweens array', function() {
      expect(t.tweens).toBeDefined();
      return expect(t.tweens instanceof Array).toBe(true);
    });
    describe('polyfills ->', function() {
      it('should have performance now defined', function() {
        return expect(window.performance.now).toBeDefined();
      });
      return it('should have requestAnimationFrame defined', function() {
        return expect(window.requestAnimationFrame).toBeDefined();
      });
    });
    describe('_loop ->', function() {
      it('should loop over', function(dfr) {
        t._startLoop();
        t.add(new Tween);
        spyOn(t, '_loop');
        return setTimeout(function() {
          expect(t._loop).toHaveBeenCalled();
          return dfr();
        }, 100);
      });
      it('should call update fun', function(dfr) {
        t._startLoop();
        spyOn(t, '_update');
        return setTimeout(function() {
          expect(t._update).toHaveBeenCalledWith(jasmine.any(Number));
          return dfr();
        }, 100);
      });
      it('should stop at the end', function(dfr) {
        t.add(new Tween);
        t._startLoop();
        setTimeout((function() {
          return t.tweens[0]._update = function() {
            return true;
          };
        }), 100);
        return setTimeout((function() {
          expect(t._isRunning).toBe(false);
          return dfr();
        }), 200);
      });
      return it('should stop if !@isRunning', function() {
        t._isRunning = false;
        spyOn(window, 'requestAnimationFrame');
        spyOn(t, '_update');
        t._loop();
        expect(window.requestAnimationFrame).not.toHaveBeenCalled();
        return expect(t._update).not.toHaveBeenCalled();
      });
    });
    describe('_startLoop method ->', function() {
      it('should call loop method', function(dfr) {
        spyOn(t, '_loop');
        t._startLoop();
        return setTimeout(function() {
          expect(t._loop).toHaveBeenCalled();
          return dfr();
        }, 60);
      });
      it('should set isRunning flag', function() {
        expect(t._isRunning).toBeFalsy();
        t._startLoop();
        return expect(t._isRunning).toBe(true);
      });
      it('should call loop only once', function() {
        t._startLoop();
        spyOn(t, '_loop');
        t._startLoop();
        return expect(t._loop).not.toHaveBeenCalled();
      });
      return it('should start only 1 concurrent loop', function() {
        t._startLoop();
        expect(t._isRunning).toBe(true);
        spyOn(window, 'requestAnimationFrame');
        t._startLoop();
        return expect(window.requestAnimationFrame).not.toHaveBeenCalled();
      });
    });
    describe('_stopLoop method ->', function() {
      return it('should set isRunning to false', function() {
        t._startLoop();
        t._stopLoop();
        return expect(t._isRunning).toBe(false);
      });
    });
    describe('add method ->', function() {
      it('should add to tweens', function() {
        t.add(new Tween);
        expect(t.tweens.length).toBe(1);
        return expect(t.tweens[0] instanceof Tween).toBe(true);
      });
      it('should add to tweens only once', function() {
        var t1;
        t1 = new Tween;
        t.add(t1);
        t.add(t1);
        expect(t.tweens.length).toBe(1);
        return expect(t.tweens[0]).toBe(t1);
      });
      it('should call _startLoop method', function() {
        spyOn(t, '_startLoop');
        t.add(new Tween);
        return expect(t._startLoop).toHaveBeenCalled();
      });
      return it('should set _isRunning to true', function() {
        var t1;
        t1 = new Tween;
        t.add(t1);
        return expect(t1._isRunning).toBe(true);
      });
    });
    describe('remove method ->', function() {
      it('should remove a tween', function() {
        var t1, t2;
        t1 = new Tween;
        t2 = new Tween;
        t.add(t1);
        t.add(t2);
        expect(t.tweens.length).toBe(2);
        t.remove(t2);
        return expect(t.tweens.length).toBe(1);
      });
      it('should be able to remove by i', function() {
        var t1, t2;
        t1 = new Tween;
        t2 = new Tween;
        t.add(t1);
        t.add(t2);
        expect(t.tweens.length).toBe(2);
        t.remove(1);
        expect(t.tweens.length).toBe(1);
        return expect(t.tweens[0]).toBe(t1);
      });
      it('should set _isRunning to false', function() {
        var t1, t2;
        t1 = new Tween;
        t2 = new Tween;
        t.add(t1);
        t.add(t2);
        expect(t.tweens.length).toBe(2);
        t.remove(t1);
        expect(t1._isRunning).toBe(false);
        return expect(t2._isRunning).toBe(true);
      });
      return it('should call _onTweenerRemove method on each ', function() {
        var t1;
        t1 = new Tween;
        t.add(t1);
        expect(t.tweens.length).toBe(1);
        spyOn(t1, '_onTweenerRemove');
        t.remove(t1);
        return expect(t1._onTweenerRemove).toHaveBeenCalled();
      });
    });
    describe('removeAll method ->', function() {
      return it('should remove all tweens', function() {
        var t1, t2;
        t1 = new Tween;
        t2 = new Tween;
        t.add(t1);
        t.add(t2);
        expect(t.tweens.length).toBe(2);
        t.removeAll();
        return expect(t.tweens.length).toBe(0);
      });
    });
    return describe('_update method ->', function() {
      it('should update the current time on every timeline', function() {
        var time;
        t.add(new Tween);
        t.add(new Tween);
        spyOn(t.tweens[0], '_update');
        spyOn(t.tweens[1], '_update');
        t._update(time = performance.now() + 200);
        expect(t.tweens[0]._update).toHaveBeenCalledWith(time);
        return expect(t.tweens[1]._update).toHaveBeenCalledWith(time);
      });
      it('should remove tween if ended', function() {
        var time, tw;
        tw = new Tween;
        t.add(tw);
        tw._update = function() {
          return true;
        };
        expect(t.tweens[0]).toBe(tw);
        spyOn(t, 'remove').and.callThrough();
        t._update(time = performance.now() + 200);
        expect(t.remove).toHaveBeenCalledWith(tw);
        return expect(t.tweens[0]).not.toBeDefined();
      });
      it('should set tween\'s _prevTime to undefined if ended', function(dfr) {
        var startTime, tw;
        tw = new Tween({
          duration: 100
        });
        tw._setStartTime();
        t.add(tw);
        expect(t.tweens[0]).toBe(tw);
        spyOn(t, 'remove').and.callThrough();
        startTime = performance.now();
        return setTimeout(function() {
          expect(tw._prevTime).toBe(void 0);
          return dfr();
        }, 400);
      });
      return it('should call tween\'s _onTweenerFinish if ended', function(dfr) {
        var duration, tw;
        duration = 50;
        tw = new Tween({
          duration: duration
        });
        tw._setStartTime();
        t.add(tw);
        expect(t.tweens[0]).toBe(tw);
        spyOn(tw, '_onTweenerFinish');
        return setTimeout(function() {
          expect(tw._onTweenerFinish).toHaveBeenCalled();
          return dfr();
        }, 2 * duration);
      });
    });
  });

}).call(this);
